import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ModerateThrottle,
  RelaxedThrottle,
} from 'src/coomon/decorators/custrom.throtter.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
  OrderApiResponseDto,
  PaginatedOrderResponseDto,
} from './dtos/order-api-response.dto';
import { GetUser } from 'src/coomon/decorators/get-user.decorators';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { Roles } from 'src/coomon/decorators/roles.decorator.ts.decorator';
import { Role } from 'generated/prisma/enums';
import { QueryOrderDto } from './dtos/query-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT_AUTH')
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // create Order
  @Post()
  @ModerateThrottle()
  @ApiOperation({
    summary: 'Create a new Order ',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'Order create successfully',
    type: OrderApiResponseDto,
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.orderService.createOrder(userId, createOrderDto);
  }

  // Get All Orders
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    summary: '[ADMIN] can get all order [paginated]',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'list of Ordes',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderResponseDto' },
        },
        // meta : {
        //   type : 'object',
        //   properties : {
        //     page : { type : 'number' , example : 1 },
        //     limit : { type : 'number' , example : 10 },
        //     total : { type : 'number' , example : 100 },
        //     totalPages : { type : 'number' , example : 10 }
        //   }
        // }
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Admin AccessRequired',
  })
  async getAllOrsers(@Query() query: QueryOrderDto) {
    return this.orderService.GetAllOrders(query);
  }

  //  User Get Owns Order
  @Get()
  @RelaxedThrottle()
  @ApiOperation({
    summary: 'Get all Order By Current User',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'list of Ordes',
    type: PaginatedOrderResponseDto,
  })
  async getOwnsOrder(
    @Query() query: QueryOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.orderService.FindUserOrders(userId, query);
  }

  // Admin Get Order ById
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    description: '[ADMIN] can get order by id ',
    summary: 'Get Order ById ',
  })
  @ApiParam({
    name: 'id',
    description: 'Order id ',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderResponseDto' },
        },

        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Admin Access Required',
  })
  @ApiBearerAuth('JWT_AUTH')
  async getOrderById(@Param('id') id: string , @GetUser('id') userId : string ) {
    return await this.orderService.GetOrderById(id , userId);
  } 

  // User : Get Own Order by id 
  @Get(':id') 
  @RelaxedThrottle()
  @ApiOperation({
    summary : 'Get an order by ID for current user'
  }) 
  @ApiParam({
    name : 'id',
    description : 'order id',
    example : '123e4567-e89b-12d3-a456-426614174000'  
  })
  @ApiResponse({
    description : 'Order details' ,
  })
  async getOwnOrderUserById (@Param('id') id : string , @GetUser('id') userId : string ) { 
    return await this.orderService.GetOrderById(id , userId);
  } 

  // Admin update Order 
 @Patch('admin/:id')
 @Roles(Role.ADMIN)
 @RelaxedThrottle()
 @ApiOperation({
  summary : 'Admin can update order '
 })
 @ApiParam({
  name : 'id' , description : 'Order ID ' , example : '123e4567-e89b-12d3-a456-426614174000'  
 })
 @ApiBody({
  type : UpdateOrderDto
 })
 @ApiResponse({
  description : 'Order updated successfully'
 })
 @ApiResponse({
  description : 'Order not found'
 })
 @ApiResponse({
  description : 'Admin Access Required'
 })
 @ApiBearerAuth('JWT_AUTH')
  async adminUpdateOrder (
    @Param('id') id : string , 
    @Body() updateOrderDto : UpdateOrderDto,
    @GetUser('id') userId : string 
  ) { 
   return await this.orderService.UpdateOrderById(id , updateOrderDto , userId)
  } 

  // updated own order 
  @Patch(':id')
  @ApiOperation({
    summary : 'Update own order '  
  })
  @ApiParam({
    name : 'id' , description : 'Order ID ' , example : '123e4567-e89b-12d3-a456-426614174000'  
  }) 
  @ApiBody({
    type : UpdateOrderDto
  }) 
  @ApiResponse({
    description : 'Order updated successfully' 
  }) 
  @ApiResponse({
    description : 'Order not found' 
  }) 
  @ApiResponse({
    description : 'Admin Access Required' 
  }) 
  @ApiBearerAuth('JWT_AUTH')
  async updateOwnOrder  ( 
     @Param('id') id : string , 
    @Body() updateOrderDto : UpdateOrderDto,
    @GetUser('id') userId : string 
  ) { 
   return await this.orderService.UpdateOrderById(id , updateOrderDto , userId)
  } 

  // admin cancle and order 
  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({
    summary : 'Admin can delete order '  
  })
  @ApiParam({
    name : 'id' , description : 'Order ID ' , example : '123e4567-e89b-12d3-a456-426614174000'  
  }) 
  @ApiResponse({
    description : 'Order deleted successfully' 
  }) 
  @ApiResponse({
    description : 'Order not found' 
  }) 
  @ApiResponse({
    description : 'Admin Access Required' 
  }) 
  @ApiBearerAuth('JWT_AUTH')
  async admincancleorder(
    @Param('id') id : string , 
    @GetUser('id') userId : string 
  ) { 
      return await this.orderService.CancleOrderById(id , userId) 
  } 

  // User cancle own order 
  @Delete(':id')
  @ModerateThrottle()
  @ApiOperation({
    summary : 'User can delete order '  
  })
  @ApiParam({
    name : 'id' , description : 'Order ID ' , example : '123e4567-e89b-12d3-a456-426614174000'  
  }) 
  @ApiResponse({
    description : 'Order deleted successfully' 
  }) 
  @ApiResponse({
    description : 'Order not found' 
  }) 
  @ApiResponse({
    description : 'Admin Access Required' 
  }) 
  @ApiBearerAuth('JWT_AUTH')
  async cancleownorder( 
    @Param('id') id : string , 
    @GetUser('id') userId : string 
  ) { 
      return await this.orderService.CancleOrderById(id , userId) 
  } 
}
