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
  Res,
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
import { UpdateOrderStatus } from './dto/update-status.dto';
import {
  GetOrderByIdResponseDto,
  OrderResponseDto,
  TrackOrderResponseDto,
} from './types';
import { OrderAnalyticsService } from './analytics.service';
import { ResponsePayload } from '../types';
import { ReceiptService } from './receipt.service';
import express from 'express';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly analyticsService: OrderAnalyticsService,
    private readonly receiptService: ReceiptService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order to deliver' })
  @ApiBody({ type: CreateOrdersDto, description: 'Order details' })
  @ApiBearerAuth('Bearer')
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: ResponsePayload,
  })
  async create(
    @Body() createOrdersDto: CreateOrdersDto,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.orderService.createOrders(createOrdersDto, admin);

    return {
      message: 'Order created successfully',
      data: res,
    };
  }

  @Get()
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get all orders with receiver details' })
  @ApiOkResponse({
    type: [OrderResponseDto],
  })
  async findAll(@Req() req: Request): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.orderService.getAllOrders(admin);

    return {
      message: 'Orders retrieved successfully',
      data: res,
    };
  }

  @Get('analytics')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get analytics of all orders' })
  @ApiOkResponse({
    type: ResponsePayload,
  })
  async analytics(@Req() req: Request): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.analyticsService.analytics(admin);

    return {
      data: res,
    };
  }

  @Get('/receipt/:order_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Generate a receipt for an order' })
  @ApiOkResponse({
    description: 'The order receipt detail.',
    type: GetOrderByIdResponseDto,
  })
  async generateReceipt(
    @Param('order_id') order_id: string,
    @Res() res: express.Response,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const admin = req['user'];
    const receiptBuffer = await this.receiptService.getReceipt(order_id, admin);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');

    return {
      data: res.end(receiptBuffer),
    };
  }

  @Get(':order_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get an order details' })
  @ApiOkResponse({
    description: 'The order details.',
    type: GetOrderByIdResponseDto,
  })
  async findOrder(
    @Param('order_id') order_id: string,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.orderService.getOrderById(order_id, admin);

    return {
      data: res,
    };
  }

  @Public()
  @Get('track/:order_id')
  @ApiOperation({ summary: 'Get tracking details of the order' })
  @ApiOkResponse({
    type: TrackOrderResponseDto,
  })
  async track(@Param('order_id') order_id: string): Promise<ResponsePayload> {
    const res = await this.orderService.trackOrder(order_id);

    return {
      message: 'Tracking details retrieved successfully',
      data: res,
    };
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
    type: ResponsePayload,
  })
  async updateStatus(
    @Param('order_id') order_id: string,
    @Body() updateOrderStatus: UpdateOrderStatus,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.orderService.updateOrderStatus(
      order_id,
      updateOrderStatus,
      admin,
    );

    return {
      message: res,
    };
  }

  @Delete('/:order_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiOkResponse({
    type: ResponsePayload,
  })
  async delete(
    @Param('order_id') order_id: string,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.orderService.deleteOrder(order_id, admin);

    return {
      message: res,
    };
  }
}
