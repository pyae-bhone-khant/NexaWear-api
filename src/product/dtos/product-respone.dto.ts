import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto { 
      
    @ApiProperty({
        description : "product Id",
        example : "keji394i39ifjiejri3urij3iurijike3j4i3k",
       
    }) 
    id : string

    @ApiProperty({
        description : "product name",
        example : "product name",
       
    }) 
    name : string 

    @ApiProperty({
        description : "Product description" , 
        example : "High quality wirelass headphone"
    }) 
    description : string | null 

    @ApiProperty ({
        description : "Product price", 
        example : 100
    })
    price : number  ; 

    @ApiProperty({
        description : "Product stock",
        example : 10
    })
    stock : number ; 

    @ApiProperty({
        description : "Product sku",
        example : "ECOM-W"
    })  
    sku : string ;  

    @ApiProperty({
        description : "Product image url",
        example : "https://example.com/product.jpg"
    })
    imageUrl : string | null ; 
   
   
    @ApiProperty({
        description :  'product category name',
        example : 'tech' 
    })
    categroy : string | null ; 

    @ApiProperty({
        description : "product is active",
        example : true
    })
    isActive : boolean ; 

    @ApiProperty({
        description : "product created at",
        example : "2022-01-01T00:00:00.000Z"
    })
    createdAt : Date 

    @ApiProperty({
        description : "product updated at",
        example : "2022-01-01T00:00:00.000Z"
    })
    updatedAt : Date 

  
}