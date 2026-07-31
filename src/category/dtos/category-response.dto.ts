import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto { 
    @ApiProperty({
        example : "uuid",
        description : "The id of the category ",
        required : true  ,
        type : String,
        format : "uuid" , 
        readOnly : true 
    })   
    id : string 

    @ApiProperty({
        example : "Electronics",
        required : true,
        description : "The name of the category",
        maxLength : 100
    })
    name : string  | null; 

    @ApiProperty({
        example : "This is electronics category",
        description : "The description of the category",
        required : false , 
        maxLength : 255 
       
    })
    description : string  | null; 
    
    @ApiProperty({
        example : "electornics",
        description : "This url-firedly slug for the category ",
        required : false  ,
        maxLength : 100 


    })
    slug? : string | null ; 
 
  @ApiProperty({
    example : "http://example.com/category.jpg",
    description : "The image url of the category ",
    required : false  ,
    type : String,
    maxLength : 255 , 
    nullable : true ,
    default : null 
    
  })  
  imageUrl? : string   | null

  @ApiProperty({
    example : true,
    description : "The active status of the category ",
    required : false  ,
    type : Boolean,
    default : true 
    
  })   
  isActive? : boolean  | null

  @ApiProperty({
    example : 5,
    description : "The number of products in this category",
    required : false,
    type : Number,
    default : 0
  })
  productCount : number

  @ApiProperty({
    example : "2026-07-31T07:00:00.000Z",
    description : "The date and time when the category was created",
    required : true,
    type : Date,
    readOnly : true
  })
  createdAt : Date

  @ApiProperty({
    example : "2026-07-31T07:00:00.000Z",
    description : "The date and time when the category was last updated",
    required : true,
    type : Date,
    readOnly : true
  })
  updatedAt : Date
}