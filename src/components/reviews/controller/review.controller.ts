import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { ApiTags } from '@nestjs/swagger';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { ProductReviewDto, ReviewDto } from '../dto/review.dto';

@ApiTags('Review Management')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':influencerId')
  async findAll(
    @Param('influencerId') influencerId: string,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = await this.reviewService.getInfluencerReviews(
      req,
      influencerId,
    );
    return { result };
  }

  @Get(':productReviews/:productId')
  async productReviews(
    @Param('productId') productId: string,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = await this.reviewService.getProductReviews(req, productId);
    return { result };
  }

  @Post()
  create(@Body() createReviewDto: ReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Post('product')
  createProductReviews(@Body() createReviewDto: ProductReviewDto) {
    const result = this.reviewService.createProductReview(createReviewDto);
    return result;
  }
}
