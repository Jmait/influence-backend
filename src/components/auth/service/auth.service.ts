import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  UpdateOrCreateInfluencerProfileDto,
  UserType,
} from '../dto/auth.dto';
import { UserService } from 'src/components/user/service/user.service';
import {
  ACCOUNT_NOT_FOUND,
  INVALID_PASSWORD,
} from 'src/shared/utils/error.utils';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/components/user/entities/user.entity';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}
  async connectTiktok(userId: string, tiktokAccessToken: string) {
    // Example: Fetch TikTok profile data
    const url = `https://open-api.tiktok.com/user/info/`; // Replace with actual TikTok API endpoint
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${tiktokAccessToken}`,
          },
        }),
      );
      const tiktokProfile = response.data;
      // Update influencer profile socialMedia field
      const influencerProfile =
        await this.userService.findInfluencerProfileByUserId(userId);
      if (!influencerProfile) {
        throw new BadRequestException('Influencer profile not found');
      }
      influencerProfile.socialMedia = {
        ...influencerProfile.socialMedia,
        tiktok: {
          handle: tiktokProfile.username || '',
          followers: tiktokProfile.followers_count || 0,
        },
      };
      await this.userService.saveInfluencerProfile(influencerProfile);
      return influencerProfile;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(body: RegisterDto) {
    try {
      const user = await this.userService.createUser(body);
      const token = this.generateToken({
        user: user,
      });
      return { token, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(body: LoginDto) {
    try {
      const user = await this.userService.findUserByEmail(body.email);
      if (!user) {
        throw new BadRequestException(ACCOUNT_NOT_FOUND);
      }
      const isPasswordValid = await argon2.verify(user.password, body.password);
      if (!isPasswordValid) {
        throw new BadRequestException(INVALID_PASSWORD);
      }
      const token = this.generateToken({
        user,
      });
      return { token, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private generateToken(payload: Record<string, any>): string {
    console.log('Generating token with payload:', payload);
    return this.jwtService.sign(
      {
        ...payload,
      },
      { secret: process.env.JWT_SECRET },
    );
  }

  async socialLoginOrSignup(socialUser: {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    type?: UserType;
  }) {
    // Try to find user by email
    let user = await this.userService.findUserByEmail(socialUser.email);

    if (!user) {
      // If not found, create new user
      user = await this.userService.createUser({
        email: socialUser.email,
        firstName: socialUser.name?.split(' ')[0] || socialUser.name,
        lastName: socialUser.name?.split(' ')[1] || socialUser.name,
        password: socialUser.providerId,
        type: socialUser.type || UserType.CUSTOMER,
        username: socialUser.name,
      });
    }
    const token = this.generateToken({
      userId: user.userId,
      type: user.type,
      email: user.email,
    });
    return { token, user };
  }

  async createOrUpdateInfluencerProfile(
    body: UpdateOrCreateInfluencerProfileDto,
    type: UserType,
    user: User,
  ) {
    return await this.userService.createOrUpdateInfluencerProfile(
      body,
      type,
      user,
    );
  }

  async connectTikTokAccount() {
    // TikTok account connection logic here
  }

  generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }

  getTiktokAuthUrl(req: any) {
    const client_key = process.env.TIKTOK_CLIENT_KEY || '';
    const redirectUri =
      process.env.TIKTOK_REDIRECT_URI ||
      'https://153af3752118.ngrok-free.app/auth/tiktok/callback';
    const state = req.user?.userId;
    const scope = 'user.info.basic,user.info.stats,user.info.profile';

    // Generate PKCE
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    const authUrl =
      `https://www.tiktok.com/v2/auth/authorize/` +
      `?client_key=${client_key}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    return {
      url: authUrl,
      codeVerifier, // you must store/send this to use during token exchange
    };
  }

  async handleTiktokCallback(req: any) {
    const code = req.query.code;
    const state = req.query.state;
    console.log(req.query);
    if (!code) {
      throw new BadRequestException('Missing TikTok code');
    }
    const clientId = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI;
    // Exchange code for access token
    try {
      const body = {
        client_key: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      };
      console.log('Request Body:', body);
      const response = await firstValueFrom(
        this.httpService.post(
          'https://open.tiktokapis.com/v2/oauth/token/',
          body,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      const accessToken = response.data.access_token;
      // Optionally, update user profile with TikTok token
      const userInfo = await this.getTikTokUserInfo(accessToken);
      await this.userService.connectInfluencerSocialMedia({
        userId: state,
        platform: 'tiktok',
        tiktok: {
          handle: userInfo.response.data.user.username || '',
          followers: userInfo.response.data.user.follower_count || 0,
        },
      });

      return { getTikTokUserInfo: userInfo };
    } catch (error) {
      console.error(
        'TikTok token exchange error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  async getTikTokUserInfo(accessToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,follower_count,display_name,username',

          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      // Optionally, update user profile with TikTok token
      return { response: response.data };
    } catch (error) {
      console.error(
        'TikTok token exchange error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  async getYoutubeUserInfo(accessToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      // Optionally, update user profile with YouTube token
      return { response: response.data };
    } catch (error) {
      console.error(
        'YouTube API error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  getInstagramAuthUrl(req: any) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || '';
    const state = req.user?.userId || '';
    const scope = 'user_profile,user_media';
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
    return { url: authUrl };
  }

  async handleInstagramCallback(req: any) {
    const code = req.query.code;
    const state = req.query.state;
    if (!code) {
      throw new BadRequestException('Missing Instagram code');
    }
    const clientId = process.env.INSTAGRAM_CLIENT_ID || '';
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || '';
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || '';
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.instagram.com/oauth/access_token',
          {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      const accessToken = response.data.access_token;
      // Optionally, update user profile with Instagram token
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getYoutubeAuthUrl(req: any) {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      'https://153af3752118.ngrok-free.app/auth/youtube/callback';
    const state = req.user?.userId || '';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&state=${state}`;
    return { url: authUrl };
  }

  async handleYoutubeCallback(req: any) {
    const code = req.query.code;
    const state = req.query.state;
    if (!code) {
      throw new BadRequestException('Missing GOOGLE code');
    }
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      'https://153af3752118.ngrok-free.app/auth/youtube/callback';
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      const accessToken = response.data.access_token;
      const userInfo = await this.getYoutubeUserInfo(accessToken);

      const item = userInfo.response.items[0];

      await this.userService.connectInfluencerSocialMedia({
        userId: state,
        platform: 'youtube',
        youtube: {
          handle: item.snippet.customUrl || '',
          followers: Number(item.statistics.subscriberCount) || 0, // Correct followers
        },
      });

      // Optionally, update user profile with GOOGLE token
      return { userInfo };
    } catch (error) {
      console.error(
        'GOOGLE token exchange error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
