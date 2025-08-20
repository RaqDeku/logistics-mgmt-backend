import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from '../auth/auth.guard';
import { Types } from 'mongoose';
import { UpdateOrderStatus } from './dto/update-status.dto';
import { OrderResponseDto } from './types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order to deliver' })
  @ApiBody({ type: CreateOrdersDto, description: 'Order details' })
  @ApiBearerAuth('Bearer')
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: CreateOrdersDto,
  })
  async create(@Body() createOrdersDto: CreateOrdersDto, @Req() req: Request) {
    const admin = req['user'];
    return await this.orderService.createOrders(createOrdersDto, admin);
  }

  @Get()
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get all orders with receiver details' })
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    type: [OrderResponseDto],
  })
  async findAll() {
    return await this.orderService.getAllOrders();
  }

  @Get('analytics')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get analytics of all orders' })
  async analytics() {
    return await this.orderService.analytics();
  }

  @Get('export')
  @ApiBearerAuth('Bearer')
  async export() {}

  @Get(':order_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get an order with receiver details' })
  @ApiOkResponse()
  async findOrder(@Param('order_id') order_id: string) {
    return await this.orderService.getOrderById(order_id);
  }

  @Public()
  @Get('track/:order_id')
  @ApiOperation({ summary: 'Get tracking details of the order' })
  @ApiOkResponse()
  async track(@Param('order_id') order_id: string) {
    return await this.orderService.trackOrder(order_id);
  }

  @Put(':order_id')
  @ApiBearerAuth('Bearer')
  async update(@Param('order_id') order_id: string) {}

  @Patch('status/:order_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiBody({
    description: 'Order update details',
    type: UpdateOrderStatus,
  })
  @ApiOkResponse({
    description: 'Order status updated successfully',
  })
  async updateStatus(
    @Param('order_id') order_id: string,
    @Body() updateOrderStatus: UpdateOrderStatus,
    @Req() req: Request,
  ) {
    const admin = req['user'];
    return await this.orderService.updateOrderStatus(
      order_id,
      updateOrderStatus,
      admin,
    );
  }

  @Delete('/:order_id')
  @ApiBearerAuth('Bearer')
  async delete(@Param('order_id') order_id: string) {}
}
