import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Order Management')
@Controller('admin/order')
export class AdminOrderManagementController {}
