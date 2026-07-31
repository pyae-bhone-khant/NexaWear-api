import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductResponseDto } from './dtos/product-respone.dto';
import { Category, Prisma, Product } from 'generated/prisma/client';
import { QueryProductDto } from './dtos/query-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor (private readonly prisma : PrismaService) {}

    async CreateProduct (createProductDto : CreateProductDto) : Promise<ProductResponseDto> {
        
        const exitingSku = await this.prisma.product.findUnique({
            where : {
                sku : createProductDto.sku
            } 
        }) 

        if (exitingSku) { 
            throw new ConflictException(
        `Product with Sku ${createProductDto.sku} already exists`
            ); 

        } 

        const product = await this.prisma.product.create({
            data : {
                ...createProductDto,
                price : new Prisma.Decimal(createProductDto.price),
            }, 
            include : {
                category : true
            }
        }) 
        return this.formatproduct(product) ;
    }  

    private formatproduct (product : Product & {category : Category} ) : ProductResponseDto { 
        return { 
            ...product , 
            price : Number(product.price),
            categroy : product.category.name        
        } 
    } 
    
    async fineAll (queryDto : QueryProductDto )  : Promise<{
        data : ProductResponseDto[] , 
        meta : {
            page : number,
            limit : number,
            total : number,
            totalPages : number
        }
    }>{ 
        const  {category , isActive , search , page = 1 , limit = 10 } = queryDto  ; 

        const where : Prisma.ProductWhereInput = { }

        if (category) {
            where.categoryId = category 
        } 
         
        if (isActive !== undefined) { 
            where.isActive = isActive
        } 

        if (search) { 
            where.OR = [ 
                {name : {contains : search ,  mode : 'insensitive'}} , 
                {description : {contains : search , mode : 'insensitive'}} ,
             ] 
        }  

        const total = await this.prisma.product.count({where}) 

        const products = await this.prisma.product.findMany({ 
            where , 
            skip : (page -1 ) * limit , 
            take : limit  , 
            orderBy : {createdAt : "desc"} , 
            include :{ 
                category : true
            }
        }) 

        return { 
            data : products.map((product) => this.formatproduct(product)) , 
            meta : {
                page ,
                limit ,
                total ,
                totalPages : Math.ceil(total / limit)
            }
        }
    } 

    async findOne (id : string) : Promise<ProductResponseDto> {
       
        const product = await this.prisma.product.findUnique({
            where : {
                id 
            } ,
            include : {
                category : true
            }
        })

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`) ; 
        } 
        return this.formatproduct(product) ;
    } 

    async UpdateProduct (id : string , updateProductDto : UpdateProductDto) : Promise<ProductResponseDto> {  
        
        const exitingProduct = await this.prisma.product.findUnique({
            where : {
                id 
            }
        }) 

        if (!exitingProduct) { 
            throw new NotFoundException(`Product with id ${id} not found`) ; 
        }  

      if (updateProductDto  && updateProductDto.sku !== exitingProduct.sku) {
        const SkuTaken = await this.prisma.product.findUnique({
            where : {
                sku : updateProductDto.sku
            }
        }) 

        if (SkuTaken) {
            throw new ConflictException(`Product with sku ${updateProductDto.sku} already exists`); 
        } 
      }

       const updateData : any =  {...updateProductDto} ; 
       if (updateProductDto && updateProductDto.price !== undefined) {
        updateData.price = new Prisma.Decimal(updateProductDto.price) 
       }
 

      const updateProduct = await this.prisma.product.update({ 
        where : {
            id 
        } , 
        data : updateData , 
        include : { 
            category : true
        }
      })

      return this.formatproduct(updateProduct) ; 
    }   

    async updateStock (id : string ,  quantity : number )  : Promise <ProductResponseDto>{

        const product = await this.prisma.product.findUnique({
            where : {id}
        }) 
         
        if (!product) { 
            throw new NotFoundException("Product Not Found ")
        } 

        const newStock = product.stock + quantity ; 
     
        if (newStock < 0) { 
            throw new BadRequestException('insufficient stock  ')
        } 

        const updateProduct  = await this.prisma.product.update({
            where : {
                id 
            } ,
            data : {
                stock : newStock 
            } ,
            include : {
                category : true
            }  
        }) 
        
        return this.formatproduct(updateProduct) ;
    } 
    
    // Delete Product 
    async DeleteProduct (id : string)  : Promise<{message : string}>{
     
        const exitingProduct = await this.prisma.product.findUnique({
            where : {
                id 
            } , 
            include : {
                orderItems : true  , 
                cartItems : true
            }
        }) 

        if (!exitingProduct) { 
            throw new NotFoundException(`Product with id ${id} not found`) ; 
        }   

        if (exitingProduct.orderItems.length > 0 ) { 
            throw new BadRequestException(` cannot delete product that has order items `) ; 
        }  


   
        await this.prisma.product.delete({
            where : {
                id 
            } 
        }) 

        return {message : "Product deleted successfully"} 
         
    }
}
