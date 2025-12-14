import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { Order } from '../entities/order.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/order.dto';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@ApiTags('Order Management')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async create(
    @Body() body: CreateOrderDto,
    @Req() req: ProfileRequestOptions,
  ): Promise<any> {
    const result = await this.ordersService.createNewOrder(body, req);
    return result;
  }
}
