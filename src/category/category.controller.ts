import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { RoleGuard } from 'src/coomon/guards/role.guard';
import { Roles } from 'src/coomon/decorators/roles.decorator.ts.decorator';
import { Role } from 'generated/prisma/enums';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { QueryCategoryDto } from './dtos/queryCategoryDto';
import { UpdateCategoryDto } from './dtos/update.categor.dto';

@ApiTags("category")
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {} 

  // Create a new category 
  @Post() 
  @UseGuards(JwtAuthGuard , RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-Auth")
  @ApiOperation({summary : "create category"})
  @ApiBody({type : CreateCategoryDto})
  @ApiResponse({
    status : 201,
    description : "Category created successfully" ,
    type : CategoryResponseDto 
  })
  async createCategory (@Body() createCategoryDto : CreateCategoryDto ) : Promise<CategoryResponseDto> {
    return  await this.categoryService.CreateCategory(createCategoryDto)
  } 

  // get Category All 
  @Get()
  @ApiOperation({
    summary : "Get all category"
  })
  @ApiResponse({
    status : 200,
    description : "Get all category successfully" ,
    type : CategoryResponseDto , 
    isArray : true 
  }) 
  @HttpCode(200)
  async GetAllCategory (@Query() query : QueryCategoryDto) : Promise<{
    data: CategoryResponseDto[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> { 
    return this.categoryService.findAll(query)  
  }  
   
  // Get Categorhy by Id 
  @Get(':id')
  @ApiOperation({
    summary : "get category by id"
  })
  @ApiResponse({
    status : 200 ,
    description : "get category by id successfully" ,
    type : CategoryResponseDto 
  }) 
  @HttpCode(200)
  async GetCategoryById (@Param("id") id : string) : Promise<CategoryResponseDto> { 
    return this.categoryService.findOne(id)  
  }  

  // Get category by slug 
  @Get('slug/:slug')
  @ApiOperation({
    summary : 'Get category by slug'
  }) 
  @ApiResponse({status : 404  , description : 'Category Not found '})
  @HttpCode(200)
  async GetCategoryBySlug (@Param("slug") slug : string) : Promise<CategoryResponseDto> { 
    return this.categoryService.findBySlug(slug)    
  }  

  // Update Category (Admin only) 
  @Patch(":id") 
  @ApiOperation({
    summary : "update category"
  }) 
  @UseGuards(JwtAuthGuard , RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-Auth")
  @ApiResponse({
    status : 200,
    description : "Category updated successfully" ,
    type : CategoryResponseDto 
  }) 
  async updateCategory (@Param("id") id : string , @Body() updateCategoryDto : UpdateCategoryDto) : Promise<CategoryResponseDto> { 
    return this.categoryService.updateCategory(id , updateCategoryDto)  
  }  

  // Delete Category (Admin only) 
  @Delete(":id")
  @ApiOperation({
    summary : "delete category"
  }) 
  @ApiResponse({
    status : 200,
    description : "Category deleted successfully" ,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category deleted successfully' }
      }
    }
  })  
  @UseGuards(JwtAuthGuard , RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-Auth")
  async deleteCategory(@Param("id") id : string ) : Promise<{ message: string }> { 
    return this.categoryService.deleteCategory(id)  
  }  
}
