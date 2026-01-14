import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async getInfluencerCustomers(options: ProfileRequestOptions) {
    const influencerId = options.user.influencerProfileId;
    const customers = this.customerRepo
      .createQueryBuilder('customer')
      .where('customer.influencerId = :influencerId', { influencerId })
      .andWhere('customer.deletedAt IS NULL')
      // .leftJoinAndSelect('customer.user', 'user')
      .take(options.pagination.limit)
      .skip(options.pagination.offset);

    if (options.query.q) {
      customers.andWhere(
        'user.firstName ILIKE :name OR user.lastName ILIKE :name OR user.email ILIKE :name',
        { name: `%${options.query.q}%` },
      );
    }

    const [records, counts] = await customers.getManyAndCount();
    return { records, counts };
  }

  async create(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }
}
