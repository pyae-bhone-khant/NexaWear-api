import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

class OrderItemsDto { 
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    productId : string  

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity : number 
    
    @ApiProperty({
        example : 49.99
    }) 
    @IsNumber( 
        {
        maxDecimalPlaces : 2
    } , 
    {message : "Price must be a valid number (eg .  49.99)"}
 ) 
    @Type(() => Number)
    price : number
}
 
export class  CreateOrderDto { 
    @ApiProperty({type : [OrderItemsDto]})
    @IsArray()
    @ValidateNested({each : true}) 
    @Type(() => OrderItemsDto)
    items : OrderItemsDto[] 

    @ApiProperty({required : false }) 
    @IsOptional()
    @IsString()
    shippingAddress : string
}