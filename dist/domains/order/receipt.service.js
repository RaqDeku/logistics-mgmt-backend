"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("./schema/order.schema");
const mongoose_2 = require("mongoose");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const html_pdf_node_1 = __importDefault(require("html-pdf-node"));
const company_profile_schema_1 = require("../setting/schema/company-profile.schema");
let ReceiptService = class ReceiptService {
    orderModel;
    companyProfile;
    constructor(orderModel, companyProfile) {
        this.orderModel = orderModel;
        this.companyProfile = companyProfile;
    }
    async getReceipt(order_id) {
        const order = await this.orderModel
            .findOne({ order_id })
            .select('-updatedAt -__v')
            .populate([
            { path: 'receiver', select: '-createdAt -updatedAt -orders -__v' },
            { path: 'sender', select: '-createdAt -updatedAt -orders -__v' },
        ])
            .lean()
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const companyProfile = await this.companyProfile
            .findOne()
            .select('-createdAt -updatedAt -__v')
            .lean()
            .exec();
        try {
            const html = await this.parseReceiptTemplate({
                ...order,
                ...companyProfile,
                receipt_date: new Date(Date.now()).toDateString(),
            });
            return await this.generateReceipt(html);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async parseReceiptTemplate(data) {
        const filePath = path_1.default.join(__dirname, '.', 'templates', 'receipt.hbs');
        const templateFile = fs_1.default.readFileSync(filePath, 'utf8');
        const template = handlebars_1.default.compile(templateFile);
        return template(data);
    }
    async generateReceipt(html) {
        const file = { content: html };
        const options = {
            format: 'A4',
            printBackground: true,
        };
        return await html_pdf_node_1.default.generatePdf(file, options);
    }
};
exports.ReceiptService = ReceiptService;
exports.ReceiptService = ReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(company_profile_schema_1.CompanyProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReceiptService);
//# sourceMappingURL=receipt.service.js.map