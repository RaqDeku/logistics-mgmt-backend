import { Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Post()
    create() {}

    @Get()
    findAll() {}

    @Get('/:id')
    find() {}

    @Get('track/:orderId')
    track() {}

    @Put('/:id')
    update() {}

    @Patch('/status/:id')
    updateStatus() {}

    @Get('/export')
    export() {}

    @Delete('/:id')
    delete() {}
}