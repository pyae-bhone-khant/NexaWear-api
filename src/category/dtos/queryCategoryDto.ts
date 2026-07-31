import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min, min } from "class-validator";

export class QueryCategoryDto { 
     @ApiPropertyOptional ({
         description : "Fliter by active status" , 
        example : true
     }) 
     @Transform(({value}) => { 
        if (value === 'true' || value === true ) return true 
        if (value === 'false' || value === false ) return false 
        return  undefined 
     })
     @IsBoolean()
     @IsOptional()
    isActive : boolean 


    
    @ApiPropertyOptional({
      description : "The slug of the category" , 
      example : "electronics"
    })
    @IsOptional()
    @IsString()
    search? : string 
   
    @ApiPropertyOptional({
        example : 1 , 
        default : 1 , 
        minimum : 1 , 
        description : "Page number for pagiantion"
        
    })
    @Type(() => Number) 
    @IsNumber()
    @Min(1)
    page = 1 


    @ApiPropertyOptional({
        example : 10 ,
        default : 10 ,
        minimum : 1 ,
        description : "Page size for pagiantion" 
    }) 
    @Type(() => Number) 
    @IsNumber()
    @Min(1)
    @Max(100)
    limit = 10 
}