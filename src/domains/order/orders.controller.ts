import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrdersDto } from "./dto/create-order.dto";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new order to deliver' })
    @ApiBody({ type: CreateOrdersDto, description: 'Order details' })
    @ApiCreatedResponse({
        description: 'Order created successfully',
        type: CreateOrdersDto,
    })
    async create(@Body() createOrdersDto: CreateOrdersDto) {
        return await this.orderService.createOrders(createOrdersDto)
    }

    @Get()
    findAll() {}

    @Get('/:order_id')
    find() {}

    @Get('track/:order_id')
    track() {}

    @Put('/:order_id')
    update() {}

    @Patch('/status/:order_id')
    updateStatus() {}

    @Get('/export')
    export() {}

    @Delete('/:order_id')
    delete() {}
}