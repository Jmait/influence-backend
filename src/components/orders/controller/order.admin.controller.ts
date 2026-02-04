import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Req,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from '../service/orders.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { UpdateOrderStatusDto } from '../dto/order.dto';

@ApiTags('Admin Order Management')
@Controller('admin/order')
export class AdminOrderManagementController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description:
      'Retrieve all orders with customer details, items, and shipping information. Supports filtering by status, payment status, and search',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by order reference, customer name, or email',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by order status (PENDING, SHIPPED, DELIVERED, etc.)',
  })
  @ApiQuery({
    name: 'paymentStatus',
    required: false,
    description: 'Filter by payment status (SUCCESS, FAILED, PENDING)',
  })
  async getOrders(@Req() req: ProfileRequestOptions) {
    return await this.ordersService.getOrdersForAdmin(req);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get order statistics',
    description:
      'Get comprehensive order statistics including total pending, shipped, delivered, cancelled, returned orders, and total revenue',
  })
  async getOrderStats() {
    return await this.ordersService.getOrderStatsForAdmin();
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get total successful orders revenue',
    description:
      'Get the total revenue from all successful orders and order count',
  })
  async getTotalSuccessfulOrdersRevenue() {
    return await this.ordersService.getTotalSuccessfulOrdersRevenue();
  }

  @Get('revenue-by-influencer')
  @ApiOperation({
    summary: 'Get revenue breakdown by influencer',
    description:
      'Get revenue statistics grouped by influencer, showing total revenue and order count per influencer',
  })
  async getRevenueByInfluencer() {
    return await this.ordersService.getRevenueByInfluencer();
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Get order details',
    description:
      'Retrieve detailed information about a specific order including items, customer, and shipping details',
  })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async getOrderDetails(@Param('orderId') orderId: string) {
    return await this.ordersService.getOrderDetailsForAdmin(orderId);
  }

  @Put(':orderId/status')
  @ApiOperation({
    summary: 'Update order status',
    description:
      'Update the status of an order (PENDING, SHIPPED, IN_PROGRESS, DELIVERED, CANCELLED)',
  })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatusByAdmin(orderId, body);
  }

  @Post(':orderId/cancel')
  @ApiOperation({
    summary: 'Cancel an order',
    description:
      'Cancel an order. Cannot cancel orders that have already been delivered',
  })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async cancelOrder(@Param('orderId') orderId: string) {
    return await this.ordersService.cancelOrderByAdmin(orderId);
  }

  @Post(':orderId/return')
  @ApiOperation({
    summary: 'Mark order as returned',
    description:
      'Mark a delivered order as returned. Only delivered orders can be marked as returned',
  })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async markAsReturned(@Param('orderId') orderId: string) {
    return await this.ordersService.markOrderAsReturned(orderId);
  }
}
