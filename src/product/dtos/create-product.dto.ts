import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphone',
    maxLength: 52,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(52)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Wireless Headphone',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 100,
    minimum: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
    minimum: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'Product sku',
    example: 'WH-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Product image',
    example: 'https://example.com/product.jpg',
    type: 'string',
    format: 'url',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description : "Product category name",  
    example : "tech" , 
    required : true
  })
  @IsString()
  @IsOptional() 
  categoryId: string;
  
  
  @ApiProperty({
    description : "Product is active",
    example : true,
    default : true,
    required : false
  })
  @IsBoolean()
  @IsOptional()  
  isActive : boolean  ;
 
}
