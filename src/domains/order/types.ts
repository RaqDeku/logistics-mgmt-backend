import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsNotEmpty, IsObject, IsString, MaxLength } from "class-validator"

export class ReceiverAddress {
    @ApiProperty({
      description: "The receiver's city/town",
      example: "Kumasi",
    })
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty({
      description: "The receiver's region",
      example: "Ashanti region",
    })
    @IsNotEmpty()
    @IsString()
    region: string

    @ApiProperty({
      description: "The receiver's country",
      example: "Ghana",
    })
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty({
      description: "The receiver's pick up location address",
      example: "house no 8, knust avenue",
    })
    @IsNotEmpty()
    @IsString()
    address: string
}

export class ReceiverInformation {
    @ApiProperty({
      description: "The receiver's full name",
      example: "Joe Doe",
    })
    @IsNotEmpty()
    @IsString()
    full_name: string

    @ApiProperty({
      description: "The receiver's phone number",
      example: "+233 200000001",
    })
    @IsString()
    @IsNotEmpty()
    mobile_number: string

    @ApiProperty({
      description: "The receiver's email",
      example: "receiver@gmail.com",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
      description: "The receiver's address",
      type: ReceiverAddress
    })
    @IsNotEmpty()
    @IsObject()
    address: ReceiverAddress
}


export class ItemInformation {
    @ApiProperty({
      description: "The item type",
      example: "Gold Necklace",
    })
    @IsNotEmpty()
    @IsString()
    item_type: string

    @ApiProperty({
      description: "The item description",
      example: "This is a 24k Gold Necklace",
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    item_description: string

    @ApiProperty({
      description: "The item net weight",
      example: "50 g",
    })
    @IsNotEmpty()
    @IsString()
    net_weight: string

    @ApiProperty({
      description: "The item's estimated delivery date",
      example: "2025-01-01",
    })
    @IsNotEmpty()
    @IsDateString({ strict: true }) 
    estimated_delivery_date: Date
}