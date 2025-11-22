import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Review Management')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Post()
  create(@Body() createReviewDto: any) {
    return this.reviewService.create(createReviewDto);
  }
}
