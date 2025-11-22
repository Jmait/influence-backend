import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'https://153af3752118.ngrok-free.app/auth/youtube/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const userType = req.query.state;

    console.log('GoogleStrategy - Received userType:', userType);
    try {
      const user = {
        provider: 'google',
        providerId: id,
        email: emails[0].value,
        name: displayName,
        type: userType,
      };
      done(null, user);
    } catch (error) {
      console.error('Google Strategy - validate error:', error);
    }
  }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const type = request.query.state;

    console.log('GoogleAuthGuard - Received type:', type);

    // Store in session BEFORE OAuth redirect
    if (type) {
      request.session.type = type;
      console.log('GoogleAuthGuard - Saving type to session:', type);

      // Ensure session is saved before redirect
      await new Promise<void>((resolve) => {
        request.session.save((err) => {
          if (err) console.error('Session save error:', err);
          else console.log('Session saved successfully');
          resolve();
        });
      });
    }

    // Call parent canActivate (this triggers the OAuth redirect)
    return super.canActivate(context) as Promise<boolean>;
  }

  // This method provides options to Passport
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const type = request.query.state;

    console.log('GoogleAuthGuard - Sending state to Google:', type);

    return {
      state: type,
      scope: ['email', 'profile'],
    };
  }
}
