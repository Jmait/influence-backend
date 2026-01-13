import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { ProductVariants } from '../entities/product-variants.entity';
import { PRODUCT_NOT_FOUND } from 'src/shared/utils/error.utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  buildFilter(query: any) {
    const filters = {};
    if (query.name) {
      filters['name'] = query.name;
    }
    if (query.shopId) {
      filters['shopId'] = query.shopId;
    }
    return filters;
  }
  async getAllProducts(
    options: ProfileRequestOptions,
  ): Promise<{ records: Product[]; counts: number }> {
    const { query, pagination } = options;
    const { limit, offset } = pagination;
    const filters = this.buildProfileSearchFilter(options.query);
    const products = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('product.influencer', 'influencer')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deletedAt IS NULL')
      .take(limit)
      .skip(offset);

    if (query) {
      filters.forEach((filter) => products.andWhere(filter.sql, filter.params));
      if (query.sort) {
        this.applySorting(products, query.sort);
      }
    }
    const [records, counts] = await products.getManyAndCount();

    return { records, counts };
  }

  async getInfluencerProducts(
    options: ProfileRequestOptions,
    influencerId: string,
  ): Promise<{ records: Product[]; counts: number }> {
    const { query, pagination } = options;
    const { limit, offset } = pagination;
    const filters = this.buildProfileSearchFilter(options.query);
    const products = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('product.influencer', 'influencer')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.influencerId = :influencerId', { influencerId })
      .andWhere('product.deletedAt IS NULL')
      .take(limit)
      .skip(offset);

    if (query) {
      filters.forEach((filter) => products.andWhere(filter.sql, filter.params));
      if (query.sort) {
        this.applySorting(products, query.sort);
      }
    }
    const [records, counts] = await products.getManyAndCount();

    return { records, counts };
  }

  async findOne(id: string): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOne({
        where: { productId: id },
        relations: ['variants'],
      });
      if (!product) {
        throw new BadRequestException(PRODUCT_NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(
    productData: CreateProductDto,
    Options: ProfileRequestOptions,
  ): Promise<Product | null> {
    try {
      return await this.productRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const productEntity = transactionalEntityManager.create(Product, {
            ...productData,
            influencerId: Options.user.influencerProfileId,
          });
          const product = await transactionalEntityManager.save(productEntity);
          for (let i = 0; i < productData.variants.length; i++) {
            console.log(product);
            const variantData = productData.variants[i];
            const variant = transactionalEntityManager.create(ProductVariants, {
              ...variantData,
              productId: product.productId,
            });
            await transactionalEntityManager.save(variant);
          }
          return transactionalEntityManager.findOne(Product, {
            where: { productId: product.productId },
            relations: ['variants'],
          });
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    productId: string,
    body: UpdateProductDto,
  ): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOne({
        where: { productId },
      });
      if (!product) {
        throw new BadRequestException(PRODUCT_NOT_FOUND);
      }
      return await this.productRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const updatedProduct = transactionalEntityManager.merge(
            Product,
            product,
            body,
          );
          for (const variant of body.variants || []) {
            await transactionalEntityManager.update(
              ProductVariants,
              variant.variantId,
              variant,
            );
          }
          return transactionalEntityManager.save(updatedProduct);
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });
    if (!product) {
      throw new BadRequestException(PRODUCT_NOT_FOUND);
    }
    await this.productRepository.update(productId, { deletedAt: new Date() });
    return product;
  }

  buildProfileSearchFilter(query: any) {
    const where: { sql: string; params: any }[] = [];

    // Username
    if (query.username) {
      where.push({
        sql: 'profile.username ILIKE :username',
        params: { username: `%${query.username}%` },
      });
    }

    // First name
    if (query.firstName) {
      where.push({
        sql: 'user.firstName ILIKE :firstName',
        params: { firstName: `%${query.firstName}%` },
      });
    }

    // Last name
    if (query.q) {
      where.push({
        sql: 'user.name ILIKE :name',
        params: { name: `%${query.q}%` },
      });
    }

    // Single category
    if (query.categoryId) {
      where.push({
        sql: 'profile.categoryId = :categoryId',
        params: { categoryId: query.categoryId },
      });
    }

    //shopId

    if (query.shopId) {
      where.push({
        sql: 'profile.shopId = :shopId',
        params: { shopId: query.shopId },
      });
    }

    // MULTIPLE categories
    if (query.categoryIds?.length > 0) {
      where.push({
        sql: 'profile.categoryId IN (:...categoryIds)',
        params: { categoryIds: query.categoryIds },
      });
    }

    // Single subcategory
    if (query.subCategoryId) {
      where.push({
        sql: 'profile.subCategoryId = :subCategoryId',
        params: { subCategoryId: query.subCategoryId },
      });
    }

    // MULTIPLE subcategories
    if (query.subCategoryIds?.length > 0) {
      where.push({
        sql: 'profile.subCategoryId IN (:...subCategoryIds)',
        params: { subCategoryIds: query.subCategoryIds },
      });
    }

    return where;
  }

  applySorting(qb: SelectQueryBuilder<any>, sort?: string) {
    console.log('Applying sorting:', sort);
    switch (sort) {
      case 'newest':
        qb.orderBy('profile.createdAt', 'DESC');
        break;

      case 'oldest':
        qb.orderBy('profile.createdAt', 'ASC');
        break;

      case 'followers_desc':
        qb.orderBy('profile.totalFollowers', 'DESC');
        break;

      case 'followers_asc':
        qb.orderBy('profile.totalFollowers', 'ASC');
        break;

      case 'engagement_desc':
        qb.orderBy('profile.averageEngagement', 'DESC');
        break;

      case 'engagement_asc':
        qb.orderBy('profile.averageEngagement', 'ASC');
        break;

      case 'rating_desc':
        qb.orderBy('profile.rating', 'DESC');
        break;

      case 'rating_asc':
        qb.orderBy('profile.rating', 'ASC');
        break;

      case 'alphabetical':
        qb.orderBy('user.firstName', 'ASC');
        break;

      case 'random':
        qb.orderBy('RANDOM()');
        break;

      default:
        qb.orderBy('profile.createdAt', 'DESC');
    }
  }
}
