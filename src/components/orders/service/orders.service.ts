import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async create(order: Order): Promise<Order> {
    return this.orderRepo.save(order);
  }
}
