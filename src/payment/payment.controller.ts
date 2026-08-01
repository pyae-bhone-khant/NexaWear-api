import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentIntentApiResponeDto } from './dtos/create-payment-intent-res.dto';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent-dto';
import { GetUser } from 'src/coomon/decorators/get-user.decorators';
import { ConfirmPaymentDto } from './dtos/comfirm-payment-dto';


@Controller('payment')
@UseGuards(JwtAuthGuard)
@ApiTags('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {} 


  // payment intent 
  @Post('create-intent')
  @ApiOperation({
    summary : 'create payment intent' , 
    description : 'Create a payment intent for an order '
  }) 
  @ApiCreatedResponse({
    description : 'payment intent created successfully ',
    type : CreatePaymentIntentApiResponeDto
  }) 
  async createPaymentIntent (@Body() createpaymentIntentDto : CreatePaymentIntentDto , @GetUser('id') userId : string) {
    return await this.paymentService.createPaymentIntent(userId , createpaymentIntentDto) 
  }     

    // comfirm payment 
    @Post('confirm')
    @ApiOperation({
      summary : 'Confirm payment' ,
      description : 'Confirm a payment intent '  
    })
    @ApiResponse({
      status : 200 , 
      description : 'Payment confirmed successfully ', 
    })
    async comfirmPayment (@Body() confirmPaymentDto : ConfirmPaymentDto , @GetUser('id  ') userId : string) { 
      return await this.paymentService.confirmPayment(userId , confirmPaymentDto)
    }
  
    @Get() 
    @ApiOperation({
      summary : 'Get all payments' ,
      description : 'Get all payments for the user'
    })  
    @ApiResponse({
      status : 200 ,
      description : 'Payments fetched successfully '
    }) 
    async findAll ( @GetUser('id') userId : string) { 
      return await this.paymentService.findAll(userId) 
    } 

    // Get payment byId 
    @Get(':id') 
    @ApiParam({
      name : 'id' , 
      description : 'Payment ID'
    }) 
    @ApiOperation({
      summary : 'Get payment by ID' ,
      description : 'Get payment by ID'
    }) 
    @ApiResponse({
      status : 200 ,
      description : 'Payment fetched successfully '  
    }) 
    async getPaymentById (@GetUser('id') userId : string , @Param('id') id : string) { 
      return await this.paymentService.getPaymentById(userId , id) 
    }

    //get payment by orderId 
    @Get('order/:orderId')
    @ApiParam({
      name : 'orderId' , 
      description : 'Order ID'
    }) 
    @ApiOperation({
      summary : 'Get payment by Order ID' ,
      description : 'Get payment by Order ID'
    }) 
    @ApiResponse({
      status : 200 ,
      description : 'Payment fetched successfully '  
    }) 
    async getPaymentByOrderId (@GetUser('orderId') userId : string , @Param('orderId') orderId : string) { 
      return await this.paymentService.getPaymentByOrderId(userId , orderId) 
    }
}
