import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateCategoryDto { 
    @ApiProperty({
        example : "Electronics",
        required : true,
        description : "The name of the category",
        maxLength : 100
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name : string ; 


    @ApiProperty({
        example : "This is electronics category",
        description : "The description of the category",
        required : false , 
        maxLength : 255 
       
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description : string ; 
    
    @ApiProperty({
        example : "electornics",
        description : "This url-firedly slug for the category ",
        required : false  ,
        maxLength : 100 


    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    slug? : string 
 
  @ApiProperty({
    example : "http://example.com/category.jpg",
    description : "The image url of the category ",
    required : false  ,
    type : String,
    maxLength : 255 ,
    nullable : true ,
    default : null 
    
  })  
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl? : string  

  @ApiProperty({
    example : true,
    description : "The active status of the category ",
    required : false  ,
    type : Boolean,
    default : true 
    
  })   
  @IsOptional()
  @IsBoolean()
  isActive? : boolean 
}