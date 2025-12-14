import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import {
  CreateOrderDto,
  OrderListFilterDto,
  UpdateOrderStatusDto,
} from '../dto/order.dto';
import { Product } from 'src/components/products/entities/product.entity';
import { OrderItem } from '../entities/order-items.entity';
import { PaymentService } from 'src/components/payment/service/payment.service';
import { Customer } from 'src/components/customers/entities/customer.entity';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { User } from 'src/components/user/entities/user.entity';
import {
  ORDER_NOT_FOUND,
  OUT_OF_STOCK,
  productOrCampaignNotFound,
  USER_ACCOUNT_NOT_FOUND,
} from 'src/shared/utils/error.utils';
import { Campaigns } from 'src/components/influencer-service/entities/influencer.entity';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(InfluencerProfile)
    private readonly influencerProfileRepo: Repository<InfluencerProfile>,

    @InjectRepository(OrderItem)
    private readonly orderItem: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Campaigns)
    private readonly campaignRepo: Repository<Campaigns>,

    private readonly paymentService: PaymentService,
  ) {}

  async createNewOrder(dto: CreateOrderDto, options: ProfileRequestOptions) {
    try {
      const { items, ...rest } = dto;

      const user = await this.userRepo.findOne({
        where: { userId: options.user.userId },
      });
      const userId = options.user.userId;
      if (!user) {
        throw new BadRequestException(USER_ACCOUNT_NOT_FOUND);
      }

      let paymentClientSecret: string = '';
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        const [product, campaign] = await Promise.all([
          this.productRepo.findOne({
            where: { productId: element.productId },
          }),
          this.campaignRepo.findOne({
            where: { serviceId: element.productId },
          }),
        ]);
        if (!product && !campaign) {
          throw new BadRequestException(
            productOrCampaignNotFound(element.productId),
          );
        }
        if (product && element.quantity > product.quantity) {
          throw new BadRequestException(OUT_OF_STOCK(product.name));
        }
      }
      await this.orderRepo.manager.transaction(
        async (transactionalEntityManager) => {
          const order = this.orderRepo.create({
            ...rest,
            userId: user.userId,
            totalPrice: dto.items.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0),
          });
          const savedOrder = await transactionalEntityManager.save(order);

          if (savedOrder) {
            for (let index = 0; index < items.length; index++) {
              const element = items[index];
              const orderItem = this.orderItem.create({
                orderId: savedOrder.orderId,
                productId: element.productId,
                name: element.name,
                type: element.type,
                price: element.price,
                quantity: element.quantity,
              });
              await transactionalEntityManager.save(orderItem);
            }
          }

          const existingCustomer = await this.customerRepo.findOne({
            where: {
              customerId: userId,
              influencerId: rest.influencerId,
            },
          });
          if (!existingCustomer) {
            await transactionalEntityManager.save(
              this.customerRepo.create({
                customerId: userId,
                influencerId: rest.influencerId,
              }),
            );
          }
          const clientSecret =
            await this.paymentService.initiatePaymentCollection({
              amount: dto.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
              ),
              currency: 'eur',
              paymentMethod: 'CARD',
              metadata: { orderId: savedOrder.orderId.toString() },
              email: user.email,
            });
          paymentClientSecret = clientSecret ?? '';
        },
      );

      return { clientSecret: paymentClientSecret };
    } catch (error) {
      this.logger.error(`Error creating new order: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async create(order: Order): Promise<Order> {
    return this.orderRepo.save(order);
  }

  async salesOverview(influencerId: string) {
    try {
      const totalSales = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(order.totalPrice)', 'total')
        .where('order.paymentStatus = :status', { status: 'SUCCESS' })
        .andWhere('order.influencerId = :influencerId', { influencerId })
        .getRawOne();
      const averegaeRatings = await this.influencerProfileRepo
        .createQueryBuilder('profile')
        .where('profile.influencerProfileId = :influencerId', { influencerId })
        .select('AVG(profile.rating)', 'average')
        .getRawOne();
      console.log(influencerId);
      const currentMonthSales = await this.orderRepo
        .createQueryBuilder('order')
        .where('order.influencerId = :influencerId', { influencerId })
        .select('SUM(order.totalPrice)', 'total')
        .andWhere(
          'EXTRACT(MONTH FROM order.createdAt) = EXTRACT(MONTH FROM CURRENT_DATE)',
        )
        .andWhere(
          'EXTRACT(YEAR FROM order.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)',
        )
        .andWhere('order.paymentStatus = :status', { status: 'SUCCESS' })
        .getRawOne();
      return {
        totalSales: parseFloat(totalSales.total) || 0,
        averageRatings: parseFloat(averegaeRatings.average) || 0,
        currentMonthSales: parseFloat(currentMonthSales.total) || 0,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrders(options: ProfileRequestOptions, query: OrderListFilterDto) {
    try {
      const influencerId = options.user.influencerProfileId;
      const { pagination } = options;
      console.log('Pagination Options:', pagination);
      let order = this.orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .where('order.influencerId = :influencerId', { influencerId })
        .take(pagination.limit)
        .skip(pagination.offset)
        .leftJoinAndSelect('order.customer', 'customer');

      if (query.type) {
        order = order.andWhere('items.type = :type', { type: query.type });
      }

      if (options.query.q) {
        order = order.andWhere('order.reference ILIKE :reference', {
          reference: `%${options.query.q}%`,
        });
      }

      const [totalRecords, count] = await order.getManyAndCount();

      return { totalRecords, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrderDetails(orderId: string): Promise<Order> {
    try {
      const order = await this.orderRepo.findOne({
        where: { orderId },
        relations: ['items', 'customer', 'shippingAddress'],
      });
      if (!order) {
        throw new BadRequestException(ORDER_NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateOrderStatus(body: UpdateOrderStatusDto, orderId: string) {
    try {
      const order = await this.orderRepo.findOne({
        where: { orderId },
      });
      if (!order) {
        throw new BadRequestException(ORDER_NOT_FOUND);
      }
      await this.orderRepo.update(orderId, body);
      return await this.orderRepo.findOne({
        where: { orderId },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
