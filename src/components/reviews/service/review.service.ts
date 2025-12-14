import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { ProductReview } from '../entities/product_review.entity';
import { ProductReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  applySorting(qb: SelectQueryBuilder<any>, sort?: string) {
    switch (sort) {
      case 'newest':
        qb.orderBy('review.createdAt', 'DESC');
        break;

      case 'oldest':
        qb.orderBy('review.createdAt', 'ASC');
        break;

      case 'rating_desc':
        qb.orderBy('review.rating', 'DESC');
        break;

      case 'rating_asc':
        qb.orderBy('review.rating', 'ASC');
        break;

      default:
        qb.orderBy('review.createdAt', 'DESC');
    }
  }

  async getInfluencerReviews(
    options: ProfileRequestOptions,
    influencerId: string,
  ): Promise<{ records: Review[]; counts: number }> {
    const { query, pagination } = options;
    const { offset: page, limit } = pagination;
    const reviews = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.influencerId = :influencerId', { influencerId })
      .leftJoinAndSelect('review.user', 'user')
      .skip((page - 1) * limit)
      .take(limit);
    if (query.sort) {
      this.applySorting(reviews, query.sort as string);
    }
    const [records, counts] = await reviews.getManyAndCount();
    return { records, counts };
  }

  async getProductReviews(
    options: ProfileRequestOptions,
    productId: string,
  ): Promise<{ records: ProductReview[]; counts: number }> {
    const { query, pagination } = options;
    const { offset: page, limit } = pagination;
    const reviews = this.productReviewRepository
      .createQueryBuilder('review')
      .where('review.productId = :productId', { productId })
      .leftJoinAndSelect('review.user', 'user')
      .skip((page - 1) * limit)
      .take(limit);
    if (query.sort) {
      this.applySorting(reviews, query.sort as string);
    }
    const [records, counts] = await reviews.getManyAndCount();
    return { records, counts };
  }

  async create(reviewData: Partial<Review>): Promise<Review> {
    try {
      const review = this.reviewRepository.create({
        influencerId: reviewData.influencerId,
        userId: reviewData.userId,
        rating: reviewData.rating,
        content: reviewData.content,
      });
      return this.reviewRepository.save(review);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createProductReview(
    reviewData: ProductReviewDto,
  ): Promise<ProductReview> {
    try {
      const review = this.productReviewRepository.create({
        productId: reviewData.productId,
        userId: reviewData.userId,
        rating: reviewData.rating,
        content: reviewData.content,
      });
      return await this.productReviewRepository.save(review);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
