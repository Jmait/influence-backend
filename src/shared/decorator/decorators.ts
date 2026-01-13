import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);

export const SKIP_PROFILE_CHECK = 'SKIP_PROFILE_CHECK';
export const SkipProfileCheck = () => SetMetadata(SKIP_PROFILE_CHECK, true);
