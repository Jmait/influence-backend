import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { Order } from '../entities/order.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, OrderListFilterDto } from '../dto/order.dto';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SuccessResponse } from 'src/shared/utils/api-response';

@ApiTags('Order Management')
@ApiBearerAuth('Bearer')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getOrders(
    @Req() req: ProfileRequestOptions,
    @Query() query: OrderListFilterDto,
  ): Promise<any> {
    console.log('Query Params:', query);
    const orders = await this.ordersService.getOrders(req, query);
    return SuccessResponse(orders, 'Orders fetched successfully');
  }

  @Get('sales-overview')
  @UseGuards(JwtGuard)
  async salesOverview(@Req() req: ProfileRequestOptions) {
    const influencerId = req.user.influencerProfileId;
    const result = await this.ordersService.salesOverview(influencerId ?? '');
    return SuccessResponse(result, 'Sales overview');
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() body: CreateOrderDto,
    @Req() req: ProfileRequestOptions,
  ): Promise<any> {
    const result = await this.ordersService.createNewOrder(body, req);
    return result;
  }
}
