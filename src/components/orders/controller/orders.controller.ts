import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { Order } from '../entities/order.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order Management')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  async create(@Body() order: Order): Promise<Order> {
    return this.ordersService.create(order);
  }
}
