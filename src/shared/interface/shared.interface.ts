import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import { User } from 'src/components/user/entities/user.entity';

export interface ProfileRequestOptions {
  user: any;
  influencerProfileId?: string;
  query: any;
  pagination: {
    page: number;
    limit: number;
  };
  influencerProfile: InfluencerProfile;
  customerProfile: any;
}
