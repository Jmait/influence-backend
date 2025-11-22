import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomersService } from '../service/customers.service';
import { Customer } from '../entities/customer.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer Management')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Post()
  async create(@Body() customer: Customer): Promise<Customer> {
    return this.customersService.create(customer);
  }
}
