import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, Prisma } from 'generated/prisma/client';
import { QueryCategoryDto } from './dtos/queryCategoryDto';
import { isNegative } from 'class-validator';
import { UpdateCategoryDto } from './dtos/update.categor.dto';


@Injectable()
export class CategoryService {  
    constructor (private prisma : PrismaService) {}

    async CreateCategory (createCategoryDto : CreateCategoryDto) : Promise<CategoryResponseDto> { 
         
        const {name , slug , ...rest} = createCategoryDto 

         const categorySlug = slug ?? name.toLowerCase().replace(/\s+/g , "-")  

         const exitingCategory = await this.prisma.category.findUnique({
            where : {
                slug : categorySlug  
            }
         })  

         if (exitingCategory) {
            throw new  Error(
                'Category with this slug ' + categorySlug
            )
         } 
    
         const category = await this.prisma.category.create({
            data : {
                name,
                slug : categorySlug,
                ...rest
            }
         }) 

         return  this.caregoryFormat(category , 0)

    }   

    private caregoryFormat ( category : Category , productCount : number ) : CategoryResponseDto { 
          return {
            id : category.id,
            name : category.name,
            description : category.description,
            slug : category.slug,
            imageUrl : category.imageUrl,
            isActive : category.isActive, 
            productCount,
            createdAt : category.createdAt , 
            updatedAt : category.updatedAt
          } 
    }

    async findAll (query : QueryCategoryDto) : Promise<{
        data : CategoryResponseDto[] ,
        metadata : {
            page : number , 
            limit : number , 
            total : number ,
            totalPages : number 
        } 
    }> {
       
    const {isActive , search , page = 1 , limit = 10 } = query; 

    const where : Prisma.CategoryWhereInput = {}
       where.isActive = isActive; 

       if (search) {
        where.OR = [
            {
                name : {contains : search , mode : 'insensitive'}
            } , 
            {
                description : {contains : search , mode : 'insensitive'} 
            } ,
        ]
       } 

     const total = await this.prisma.category.count({ where }) 

     const categories = await this.prisma.category.findMany({
        where , 
        skip : (page -1) * limit  , 
        take : limit , 
        orderBy : { createdAt : "desc"} , 
        include:{
            _count : {
                select : {products : true}
            }
        }
     }) ; 

     return  {
        data : categories.map((category) => this.caregoryFormat(category , category._count.products)) , 
    metadata : {
        page , 
        limit , 
        total , 
        totalPages : Math.ceil(total / limit) , 
    
    }
     }
    } 

    async findOne (id : string ) : Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where : {
                id 
            } ,
            include : {
                _count : {
                    select : {products : true}
                }
            } 
        }) 

        if (!category) {
            throw new  NotFoundException('Category not found')
        } 

        return this.caregoryFormat(category , Number(category._count.products)) 
    }

    async findBySlug (slug : string ) : Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where : {
                slug : slug
            } ,
            include : {
                _count : {
                    select : {products : true}
                }
            } 
        }) 

        if (!category) {
            throw new  NotFoundException('Category not found')
        } 

        return this.caregoryFormat(category , Number(category._count.products)) 
    }

    async updateCategory(id : string , updateCategoryDto : UpdateCategoryDto) : Promise<CategoryResponseDto> { 
    //    const {name , slug , ...rest} = updateCategoryDto

       const existingCategory = await this.prisma.category.findUnique({
        where : {
            id 
        }
       })  
       
       if (!existingCategory) {
        throw new NotFoundException(`Category with id ${id} not found`);
       }
    //    const categorySlug = slug ?? existingCategory.slug; 
     
    if (updateCategoryDto.slug && updateCategoryDto.slug !== existingCategory.slug) { 
        const slugTaken  =  await this.prisma.category.findUnique({
            where : {slug : updateCategoryDto.slug} , 
        }) 
        if (slugTaken) { 
            throw new Error('Category with this slug already exists');
        } 

    }
       
      const updatedCategory = await this.prisma.category.update({
        where : {
            id 
        } , 
        data : {
         ...updateCategoryDto
        } , 
        include : {
            _count : {
                select : {
                    products : true
                }
            }
        }
      }) 
     
      return this.caregoryFormat(updatedCategory , Number(updatedCategory._count.products))
       
    }

    async deleteCategory(id : string ) : Promise<{message : string}> { 
      const category = await this.prisma.category.findUnique({
        where : {id} , 
        include : {
            _count : {
                select : {
                    products : true
                }
            }
        }
      }) 

      if (!category) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }  

      if (category._count.products > 0 ) { 
       throw new BadRequestException(`Category with id ${id} has products`);
      }

      await this.prisma.category.delete({
        where : {
            id 
        } 
      }) 
      return  {message : `Category with id ${id} deleted successfully`} 
    }
}
   
