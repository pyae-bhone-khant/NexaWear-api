import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductDto {
  @ApiProperty({
    description: 'product category name',
    example: 'tech',
  })
  @IsString()
  @IsOptional()
  category: string; 
  
  @ApiPropertyOptional({
    description : "product is active",
    example : true,
    required : false
  })
  @Transform(({value}) =>  { 
    if (value === 'true' || value === true ) return true ; 
    if (value === 'false' || value === false ) return false ; 
    return undefined ; 
  })
  @IsBoolean()
  @IsOptional()
  isActive? : boolean 

  @ApiProperty({
    description : "search products",
    example : "headphone",  
  })
  @IsString()
  @IsOptional()
  search? : string 
  
  @ApiPropertyOptional({
    description : 'Page number for pagination' , 
    example  : 1 , 
    minimum : 1 , 
    default : 1  
  })
  @Type(() => Number) 
  @IsNumber()
  @IsOptional()
  @Min(1)
  page : number = 1   


 @ApiPropertyOptional({
    description : 'limit number of products per page' , 
    example  : 10 , 
    minimum : 1 , 
    default : 10  
  })
  @Type(() => Number) 
  @IsNumber()
  @IsOptional()
  @Min(10)
  limit : number = 10   

 
}
