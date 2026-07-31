import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "generated/prisma/enums";

export class UpdateOrderDto { 
    
    @ApiProperty({
        description : "Order Status" ,
        enum : ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"] ,
        example : "SHIPPED" 
    })  
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status : OrderStatus 
     
    @IsOptional()
    @IsString() 
    @ApiProperty({
        description : "Tracking Number" ,
        example : "123456789" 
    })
    @IsString()
    @IsOptional()
    trackingNumber? : string 

    @ApiProperty({
        description : "Order Notes" ,
        example : "Order Notes" ,
    
    })
    @IsOptional()
    @IsString() 
    notes? : string
}