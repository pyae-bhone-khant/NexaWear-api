import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto } from './dtos/order-api-response.dto';
import { OrderStatus } from 'generated/prisma/enums';
import { Order, OrderItem, Product, User } from 'generated/prisma/client';
import { QueryOrderDto } from './dtos/query-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrderService {
    constructor (private readonly prisma : PrismaService) {}  

    private wrap(order : Order & { orderItems: (OrderItem & { product: Product })[], user: User }) :  
    OrderApiResponseDto<OrderResponseDto>
    { 
       return { 
        success : true , 
        message : "Order created successfully" , 
        data : this.map(order) 
       }

    }

    private map( 
        order: Order & {orderItems :(   OrderItem  &{product : Product } )[] ,
        user : User
 }): OrderResponseDto {
      return {
        id : order.id , 
        userId : order.userId , 
        status : order.status , 
        total : Number(order.totalAmount),
        shippingAddress : order.shippingAddress ?? "" , 
        items : order.orderItems.map((item) => ({
            id : item.id , 
            productId : item.productId , 
            productName :  item.product?.name , 
            quantity :  item.quantity , 
            price : Number(item.price) , 
            subtotal : Number(item.price)  * item.quantity  ,// total price   
            createdAt : order.createdAt , 
            updatedAt : order.updatedAt , 
        }) ) ,  
         ...(order.user && {
            userEmail : order.user.email , 
            userName :  `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()  ,        
         }),

         createdAt : order.createdAt,
         updatedAt : order.updatedAt ,
        
      }
    }

    async createOrder (userId : string , orderDto : CreateOrderDto ) :  
    Promise<OrderApiResponseDto<OrderResponseDto>>
     {
         const {items , shippingAddress } = orderDto  ; 

         for (const item of items) { 
      const product = await this.prisma.product.findUnique({
        where : {id : item.productId}
      }) 

      if (!product) { 
        throw new NotFoundException(`Product with id ${item.productId} not found`)
      } 

      if (product.stock < item.quantity) { 
        throw new BadRequestException(`Insufficient stock for product ${product.name}`)
      }  

         } 

         const total = items.reduce( 
            (sum , item) =>  sum + item.price * item.quantity, 
            0
         ) 

         const latestCart =  await  this.prisma.cart.findFirst({
            where : {
                userId , 
                checkedOut : false 
            } , 
            orderBy : {createdAt : "desc"}
         }) ; 

         if (!latestCart) {
            throw new NotFoundException('No active cart found for this user');
         } 

        const order = await this.prisma.$transaction(async (tx) => {  
             
            const newOrder  = await tx.order.create({
                data : {
                    userId , 
                    status : OrderStatus.PENDING , 
                    totalAmount: total , 
                    shippingAddress  , 
                    cartId  : latestCart.id , 
                    orderItems : { 
                        create : items.map((item ) => ({ 
                            productId : item.productId , 
                            quantity : item.quantity , 
                            price : item.price 
                        })) 
                    }
                }  ,  
                include : {
                    orderItems : {
                        include : {
                            product : true
                        }
                    } ,
                    user : true  
                }

            }) ; 

            for (const item of items ) {
               await tx.product.update({
                where : { id : item.productId} ,
                data : {
                    stock : {
                        decrement : item.quantity
                    }
                } 
               }) 
            }  
            return newOrder

        } 
    )  
    return this.wrap(order)
    }  

    async GetAllOrders(query : QueryOrderDto) : Promise<{
        data : OrderResponseDto[];
        total : number , 
        page : number , 
        limit : number 
    }> {
       
        const { page = 1 , limit = 10  , status , search} = query ; 
        const skip = (page -1 ) * limit ;

       const where : any = {}; 
       if(status) where.status = status ; 

       if (search) where.OR = [
         {id : {contains : search , mode : "insensitive"}},
         {orderNumber : {contains : search , mode : "insensitive"}},
       ];   

       const [orders , total] = await Promise.all([
         this.prisma.order.findMany({
            where,
            skip,
            take : limit,
            include : {
                orderItems : {
                    include : {
                        product : true
                    }
                }, 
                user : true
            }  ,
            orderBy : {
              createdAt : "desc" 
            }

         }),
         this.prisma.order.count({where}) ,
       ]) ; 

       return { 
        data : orders.map((o) => this.map(o)) , 
        total ,
        page ,
        limit ,
       } 
    }    
    
    
    async FindUserOrders (userId : string , query : QueryOrderDto)  : Promise<{
        data  : OrderResponseDto[];
        total : number ;
        page  : number ;
        limit : number ;
    }> { 
        const {page = 1 , limit = 10 , search , status } = query ;
         const skip = (page - 1 ) * limit ; 
         const where : any = { userId } ; 
         if (status ) where.status = status ; 

         if (search) where.OR = [
             {id : {contains : search , mode : "insensitive"}},
         ]  

         const [orders , total ] = await Promise.all([
            this.prisma.order.findMany({
                where ,
                skip , 
                take : limit , 
                include : { 
                    orderItems : {
                        include : {
                            product : true
                        } 
                    } , 
                    user : true

                }, 
             orderBy : {createdAt : "desc"} 
            }) , 
            this.prisma.order.count({where}) , 
         ]) 

         return {
            data : orders.map((o) => this.map(o)) , 
            total ,
            page,
            limit 
         }
    }
   
    // Get admin Order ById 
    async GetOrderById (id  : string ,  userId : string)   : 
    Promise<OrderApiResponseDto<OrderResponseDto>> {
         
        const where : any  = { id } 
        if (userId) where.userId = userId ;  

        const order = await this.prisma.order.findFirst({
            where , 
            include : {
                orderItems : {
                    include : {
                        product : true
                    }
                } ,
                user : true
            }
        })

        if (!order) { 
            throw new NotFoundException(`Order With Id ${id} not found`)
        } 

        return this.wrap(order) 

    }

  
    async UpdateOrderById (id : string , updateOrderDto: UpdateOrderDto , userId : string ) : Promise<OrderApiResponseDto<OrderResponseDto>> {

         const where : any =  {id} 
         if(userId) where.userId = userId ;  

         const existing  = await this.prisma.order.findFirst({
            where 
         }) 

         if (!existing) throw new NotFoundException(`Order With Id ${id} not found`) ;
       
         const updateOrder = await this.prisma.order.update({
            where : {id} , 
            data : updateOrderDto,
            include : {
                orderItems : {
                    include : {
                        product : true
                    }
                } ,
                user : true
            }
         }) 

         return this.wrap(updateOrder) 
    } 

    async CancleOrderById (id : string , userId : string ) : Promise<OrderApiResponseDto<OrderResponseDto>> {

         const where : any =  {id} 
         if(userId) where.userId = userId ;  

         const existing  = await this.prisma.order.findFirst({
            where  , 
            include : {
                orderItems : true ,
                user : true 
            }
         }) 

         if (!existing) throw new NotFoundException(`Order With Id ${id} not found`) ; 

        //  check 
        if (existing.status !== OrderStatus.PENDING )  { 
         throw new BadRequestException(`Order with id ${id} is already in status ${existing.status}`)
        }  

    const canclled = await this.prisma.$transaction(
        async (tx) => {
             for (const item of existing.orderItems) { 
                await tx.product.update({
                    where : {id : item.productId} ,
                    data : {
                        stock : {
                            increment : item.quantity
                        }
                    }
                }) 
             } 
             return await tx.order.update({
                where : {id} , 
                data : {
                    status : OrderStatus.CANCELLED 
                } ,
                include : {
                    orderItems : {
                        include : {
                            product : true
                        }
                    } ,
                    user : true
                }
             })  ; 
        }
    )  
     return this.wrap(canclled)  
    } 
}
