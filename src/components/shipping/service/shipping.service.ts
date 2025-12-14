import { BadRequestException, Body, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from '../entities/shipping.entity';
import {
  DeliverAddressDto,
  UpdateDeliverAddressDto,
} from '../dto/shipping.dto';
import {
  SHIPPING_ADDRESS_EXIST,
  SHIPPING_ADDRESS_NOT_FOUND,
} from 'src/shared/utils/error.utils';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingAddress)
    private shippingAddressRepo: Repository<ShippingAddress>,
  ) {}

  async addShippingAddress(body: DeliverAddressDto, customerId: string) {
    try {
      const exiting = await this.shippingAddressRepo.findOne({
        where: {
          addressLine1: body.addressLine1,
          firstName: body.firstName,
          lastName: body.lastName,
          customerId,
        },
      });
      if (exiting) {
        throw new BadRequestException(SHIPPING_ADDRESS_EXIST);
      }
      const newAddress = this.shippingAddressRepo.create({
        ...body,
        customerId,
      });
      const savedAddress = await this.shippingAddressRepo.save(newAddress);
      return savedAddress;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateShippingAddress(
    body: UpdateDeliverAddressDto,
    addressid: string,
  ) {
    try {
      const shipping = await this.shippingAddressRepo.findOne({
        where: { addressId: addressid },
      });
      if (!shipping) {
        throw new BadRequestException(SHIPPING_ADDRESS_NOT_FOUND);
      }
      await this.shippingAddressRepo.update(addressid, body);
      return await this.shippingAddressRepo.findOne({
        where: { addressId: addressid },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteShippingAddress(addressid: string) {
    try {
      const shipping = await this.shippingAddressRepo.findOne({
        where: { addressId: addressid },
      });
      if (!shipping) {
        throw new BadRequestException(SHIPPING_ADDRESS_NOT_FOUND);
      }
      const deletedAddress = await this.shippingAddressRepo.update(addressid, {
        deletedAt: new Date(),
      });
      return deletedAddress;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getShippingAddresses(customerId: string) {
    try {
      const addresses = await this.shippingAddressRepo
        .createQueryBuilder('shipping')
        .where('shipping.customerId = :customerId', { customerId })
        .andWhere('shipping.deletedAt IS NULL')
        .getMany();
      return addresses;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
