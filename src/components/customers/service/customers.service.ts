import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepo.find();
  }

  async create(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }
}
