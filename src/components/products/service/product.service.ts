import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { ProductVariants } from '../entities/product-variants.entity';
import { PRODUCT_NOT_FOUND } from 'src/shared/utils/error.utils';
import { StorageService } from 'src/components/storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storageService: StorageService,
  ) {}

  buildProductFilter(query: any) {
    const where: { sql: string; params: any }[] = [];

    // Product name search
    if (query.q) {
      where.push({
        sql: 'product.name ILIKE :name',
        params: { name: `%${query.q}%` },
      });
    }

    // Shop filter
    if (query.shopId) {
      where.push({
        sql: 'product.shopId = :shopId',
        params: { shopId: query.shopId },
      });
    }

    // Influencer filter
    if (query.influencerId) {
      where.push({
        sql: 'product.influencerId = :influencerId',
        params: { influencerId: query.influencerId },
      });
    }

    // Category filter
    if (query.categoryId) {
      where.push({
        sql: 'product.categoryId = :categoryId',
        params: { categoryId: query.categoryId },
      });
    }

    // Multiple categories
    if (query.categoryIds?.length > 0) {
      where.push({
        sql: 'product.categoryId IN (:...categoryIds)',
        params: { categoryIds: query.categoryIds },
      });
    }

    // Subcategory filter
    if (query.subCategoryId) {
      where.push({
        sql: 'product.subCategoryId = :subCategoryId',
        params: { subCategoryId: query.subCategoryId },
      });
    }

    // Active status filter
    if (query.isActive !== undefined) {
      where.push({
        sql: 'product.isActive = :isActive',
        params: { isActive: query.isActive },
      });
    }

    // Price range filters
    if (query.minPrice !== undefined) {
      where.push({
        sql: 'product.price >= :minPrice',
        params: { minPrice: query.minPrice },
      });
    }

    if (query.maxPrice !== undefined) {
      where.push({
        sql: 'product.price <= :maxPrice',
        params: { maxPrice: query.maxPrice },
      });
    }

    // Rating filter
    if (query.minRating !== undefined) {
      where.push({
        sql: 'product.rating >= :minRating',
        params: { minRating: query.minRating },
      });
    }

    // In stock filter (quantity > 0)
    if (query.inStock === true || query.inStock === 'true') {
      where.push({
        sql: 'product.quantity > 0',
        params: {},
      });
    }

    return where;
  }
  async getAllProducts(
    options: ProfileRequestOptions,
  ): Promise<{ records: Product[]; counts: number }> {
    const { query, pagination } = options;
    const { limit, offset } = pagination;
    const filters = this.buildProductFilter(options.query);
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
        this.applyProductSorting(products, query.sort);
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
        this.applyProductSorting(products, query.sort);
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
    files: Express.Multer.File[],
  ): Promise<Product | null> {
    try {
      const profileId = Options.user.influencerProfileId;
      return await this.productRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const productEntity = transactionalEntityManager.create(Product, {
            ...productData,
            influencerId: Options.user.influencerProfileId,
          });
          const product = await transactionalEntityManager.save(productEntity);
          if (productData.variants && productData.variants.length > 0) {
            for (let i = 0; i < productData.variants.length; i++) {
              console.log(product);
              const variantData = productData.variants[i];
              const variant = transactionalEntityManager.create(
                ProductVariants,
                {
                  ...variantData,
                  productId: product.productId,
                },
              );
              await transactionalEntityManager.save(variant);
            }
          }

          const uploadedImages: string[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = this.storageService.getFileByField(
              `productImage_${i}`,
              files,
            );
            if (file) {
              const fileUrl = (
                await this.storageService.uploadPublicFiles(file.buffer, {
                  userId: profileId,
                  service: 'products',
                  folder: 'product-images',
                  file_name: `${file.originalname}-${product.productId}`,
                  content_type: file.mimetype,
                })
              ).file_url;
              uploadedImages.push(fileUrl);
            }
          }
          if (uploadedImages.length > 0) {
            await transactionalEntityManager.update(
              Product,
              product.productId,
              {
                images: uploadedImages,
              },
            );
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

  private async updateVariants(
    transactionalEntityManager: any,
    variants: any[],
    productId: string,
  ) {
    if (variants && variants.length > 0) {
      for (const variantData of variants) {
        const variant = transactionalEntityManager.create(ProductVariants, {
          ...variantData,
          productId: productId,
        });
        await transactionalEntityManager.save(variant);
      }
    }
  }

  private async uploadProductImages(
    files: Express.Multer.File[],
    product: Product,
    transactionalEntityManager: any,
  ): Promise<void> {
    if (!files || files.length === 0) return;

    const uploadedImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = this.storageService.getFileByField(
        `productImage_${i}`,
        files,
      );
      if (file) {
        const fileUrl = (
          await this.storageService.uploadPublicFiles(file.buffer, {
            userId: product.influencerId,
            service: 'products',
            folder: 'product-images',
            file_name: `${file.originalname}-${product.productId}`,
            content_type: file.mimetype,
          })
        ).file_url;
        uploadedImages.push(fileUrl);

        // Delete old image if exists
        if (product.images?.[i]) {
          const existingImageKey = this.storageService.extractS3Key(
            product.images[i],
          );
          const newImageKey = this.storageService.extractS3Key(fileUrl);
          if (existingImageKey && existingImageKey !== newImageKey) {
            await this.storageService.deleteFile(existingImageKey);
          }
        }
      }
    }

    if (uploadedImages.length > 0) {
      await transactionalEntityManager.update(Product, product.productId, {
        images: uploadedImages,
      });
    }
  }

  async update(
    productId: string,
    body: UpdateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOne({
        where: { productId },
      });
      if (!product) {
        throw new BadRequestException(PRODUCT_NOT_FOUND);
      }

      const { variants, ...other } = body;
      return await this.productRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.update(
            Product,
            { productId },
            { ...other },
          );

          await this.updateVariants(
            transactionalEntityManager,
            variants || [],
            product.productId,
          );
          await this.uploadProductImages(
            files,
            product,
            transactionalEntityManager,
          );

          return await this.productRepository.findOne({
            where: { productId: productId },
            relations: ['variants'],
          });
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

  applyProductSorting(qb: SelectQueryBuilder<any>, sort?: string) {
    console.log('Applying product sorting:', sort);
    switch (sort) {
      case 'newest':
        qb.orderBy('product.productId', 'DESC');
        break;

      case 'price_asc':
        qb.orderBy('product.price', 'ASC');
        break;

      case 'price_desc':
        qb.orderBy('product.price', 'DESC');
        break;

      case 'rating_desc':
        qb.orderBy('product.rating', 'DESC');
        break;

      case 'rating_asc':
        qb.orderBy('product.rating', 'ASC');
        break;

      case 'alphabetical':
        qb.orderBy('product.name', 'ASC');
        break;

      case 'quantity_desc':
        qb.orderBy('product.quantity', 'DESC');
        break;

      case 'quantity_asc':
        qb.orderBy('product.quantity', 'ASC');
        break;

      default:
        qb.orderBy('product.productId', 'DESC');
    }
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
