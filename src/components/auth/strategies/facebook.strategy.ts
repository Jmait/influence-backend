import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName'],
      scope: ['email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const userType = req.query.type;
    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails && emails[0] ? emails[0].value : null,
      name: displayName,
      type: userType,
    };
    done(null, user);
  }
}
