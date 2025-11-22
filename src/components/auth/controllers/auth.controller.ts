// TikTok OAuth

import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
  LoginDto,
  RegisterDto,
  SocialLoginDto,
  UpdateOrCreateInfluencerProfileDto,
} from '../dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from '../strategies/google.strategy';
import { JwtGuard } from '../guards/jwt.guard';

@ApiTags('Auth Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Register
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @ApiBearerAuth('Bearer')
  @Get('tiktok')
  @UseGuards(JwtGuard)
  async tiktokAuth(@Req() req) {
    // Optionally pass state or userId
    console.log(req);
    return this.authService.getTiktokAuthUrl(req);
  }

  @Get('tiktok/callback')
  async tiktokCallback(@Req() req) {
    // TikTok redirects here with code
    return this.authService.handleTiktokCallback(req);
  }

  // Login
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  // Create or Update Influencer Profile
  @ApiBearerAuth('Bearer')
  @Post('influencer-profile')
  @UseGuards(JwtGuard)
  async createOrUpdateInfluencerProfile(
    @Body() body: UpdateOrCreateInfluencerProfileDto,
    @Req() req,
  ) {
    console.log(req.user);
    return await this.authService.createOrUpdateInfluencerProfile(
      body,
      req.user.type,
      req.user,
    );
  }

  // Google OAuth
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Query() type: SocialLoginDto, @Req() req: any, @Res() res) {
    req.session.type = type.state;

    await req.session.save(); // Ensure session is saved

    // // Manually trigger the guard with s
    return res.redirect(`/auth/google/callback`);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Query('state') state: string) {
    // If user exists, log in; else, sign up

    // return state;
    return this.authService.socialLoginOrSignup({
      ...req.user,
      type: req.query.state,
    });
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req) {
    // If user exists, log in; else, sign up
    return this.authService.socialLoginOrSignup(req.user);
  }

  // Instagram OAuth
  @Get('instagram')
  async instagramAuth(@Req() req) {
    return this.authService.getInstagramAuthUrl(req);
  }

  @Get('instagram/callback')
  async instagramCallback(@Req() req) {
    return this.authService.handleInstagramCallback(req);
  }

  // YouTube OAuth
  @ApiBearerAuth('Bearer')
  @Get('youtube')
  @UseGuards(JwtGuard)
  async youtubeAuth(@Req() req) {
    return this.authService.getYoutubeAuthUrl(req);
  }

  @Get('youtube/callback')
  async youtubeCallback(@Req() req) {
    return this.authService.handleYoutubeCallback(req);
  }
}
