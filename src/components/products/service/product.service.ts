import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/product.dto';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

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
  async findAll(
    options: ProfileRequestOptions,
  ): Promise<{ records: Product[]; counts: number }> {
    const filters = this.buildFilter(options.query);
    const products = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('product.influencer', 'influencer')
      .where({ ...filters });
    const [records, counts] = await products.getManyAndCount();

    return { records, counts };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { productId: id } });
  }

  async create(
    productData: CreateProductDto,
    Options: ProfileRequestOptions,
  ): Promise<Product> {
    try {
      console.log('Creating product with influencer ID:', Options.user);
      const product = this.productRepository.create({
        ...productData,
        influencerId: Options.user.influencerProfileId,
      });
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
