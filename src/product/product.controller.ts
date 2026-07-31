import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { Roles } from 'src/coomon/decorators/roles.decorator.ts.decorator';
import { RoleGuard } from 'src/coomon/guards/role.guard';
import { Role } from 'generated/prisma/enums';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductResponseDto } from './dtos/product-respone.dto';
import { QueryProductDto } from './dtos/query-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {} 

  // create products 
  @Post()  
  @UseGuards(JwtAuthGuard , RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-Auth")
  @ApiOperation({summary : "create product"})
  @ApiBody({type : CreateProductDto})
  @ApiResponse({
    status : 201,
    description : "Product created successfully" ,
    type : ProductResponseDto
  }) 
  async createProduct (@Body() createProductDto : CreateProductDto ) : Promise<ProductResponseDto> {
    return  await this.productService.CreateProduct(createProductDto) 
  } 

  // Get All product 
  @Get()
  @ApiOperation({
    summary : "Get all product"
  })  
  @ApiResponse({
    status : 200,
    description : "Get all product successfully" ,
    schema : {
      type : 'object' , 
     properties : {
      data: {
         type : 'array' , 
         items : { $ref : '#/components/schemas/ProductResponseDto'}
      }, 
      meta : { 
        type : 'object' , 
        properties : {
          page : { type : 'number' , example : 1},
          limit : { type : 'number' , example : 10},
          total : { type : 'number' , example : 100},
          totalPages : { type : 'number' , example : 10}
        }
      }
      
     }
    }
   
  }) 
  @HttpCode(200) 
  async GetAllProduct( @Query() queryDto : QueryProductDto) { 
    return await this.productService.fineAll(queryDto)
  } 


  // Get Product ById 
  @Get(":id")
  @ApiOperation({
    summary : "Get Product ById"
  })
  @ApiResponse({
    status : 200 ,
    description : "Get Product ById successfully" ,
    type : ProductResponseDto
  })
  @HttpCode(200)
  async fineOne (@Param("id") id : string ) : Promise<ProductResponseDto> { 
    return await this.productService.findOne(id) 
  } 

  // update product (admin only) 
  @Patch(":id")  
  @UseGuards(JwtAuthGuard , RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-Auth")
  @ApiOperation({
    summary : "update product"
  })
  @ApiBody({type : CreateProductDto})
  @ApiResponse({
    status : 200,
    description : "Product updated successfully" ,
    type : ProductResponseDto
  })
  async updateProduct(@Param("id") id : string , @Body() updateProductDto : UpdateProductDto ) : Promise<ProductResponseDto> { 
    return await this.productService.UpdateProduct(id  , updateProductDto )
  }

// updateProductStock  
@Patch(':id/stock')
 @UseGuards(JwtAuthGuard , RoleGuard)
 @Roles(Role.ADMIN)
 @ApiBearerAuth("JWT-Auth")
 @ApiOperation({
  summary : "update product stock"
 })
 @ApiBody({
  schema : {
    type : 'object' , 
    properties : {
      quantity : {
        type : 'number' , 
        description : "Stock adjustment (Postive to add , negative to subtract)" , 
        example : 10 
      }
    },
    required : ['quantity']
  }
 })
 @ApiResponse({
  status : 200,
  description : "Product stock updated successfully" ,
  type : ProductResponseDto
 })
 async updateProductStock ( @Param("id") id : string , @Body('quantity') quantity : number  ) { 
  return await this.productService.updateStock(id  , quantity )
 } 

//  Remove a project (admin only) 
@Delete(":id")
@UseGuards(JwtAuthGuard , RoleGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth("JWT-Auth")
@ApiOperation({
  summary : "delete product"
})
@ApiResponse({
  status : 200,
  description : "Product deleted successfully" ,
  type : ProductResponseDto
})
async deleteProduct (@Param("id") id : string ) : Promise<{message : string}> { 
  return await this.productService.DeleteProduct(id) 
}
} 
 