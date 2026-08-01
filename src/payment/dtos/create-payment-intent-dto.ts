import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentIntentDto { 

    @ApiProperty({
        example : "order-123" 
    }) 
    @IsNotEmpty()
    @IsString()
    orderId : string 

    @ApiProperty({
        example : 10000 
    })
    @IsNotEmpty()
    @IsNumber()
    amount : number  

    @ApiProperty({
        example : "usd" , 
        default : "usd" ,
        required : false 
    })
    @IsOptional()
    @IsString()
    currency? : string   ="usd" 
    
    
    @IsOptional()
    @IsString()
    description? : string
}