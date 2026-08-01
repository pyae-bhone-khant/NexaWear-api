import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent-dto';
import Stripe from 'stripe';
import { PaymentStatus } from 'generated/prisma/enums';
import { PaymentIntents } from 'stripe/cjs/resources';
import { ConfirmPaymentDto } from './dtos/comfirm-payment-dto';
import { PaymentResponseDto } from './dtos/create-payment-intent-res.dto';

@Injectable()
export class PaymentService {
    private stripe : Stripe  
    constructor (private readonly prisma : PrismaService) { 
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY! , {  
            apiVersion : '2026-07-29.dahlia'  
        })
    } 

    async createPaymentIntent (userId : string , createpaymentIntentDto : CreatePaymentIntentDto) :  
     Promise<{
        success : boolean , 
        data : {clientSecret : string ; paymentId : string } ; 
        message : string 
     }>   
     {
        const { orderId , amount , currency  = 'usd'} = createpaymentIntentDto; 
       
        const order = await this.prisma.order.findFirst({
            where : {
                id : orderId , 
                userId : userId 
            }  
        }) ;  

        if (!order) {
            throw new NotFoundException(`Order not found for the id ${orderId}`)
        }   

        const exitingPaymetnt = await this.prisma.payment.findFirst({
            where : {orderId} , 
        }) ; 

        if ( exitingPaymetnt && exitingPaymetnt.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException(`Payment already exists for the order id ${orderId}`)
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency,
            metadata: { orderId, userId }
        });

        const payment = await this.prisma.payment.create({ 
            data : { 
                orderId, 
                userId, 
                amount, 
                currency, 
                status: PaymentStatus.PENDING, 
                paymentMethod: 'STRIPE',
                transactionId: paymentIntent.id 
            }
        });

        return {
            success: true,
            data: { clientSecret: paymentIntent.client_secret as string, paymentId: payment.id },
            message: "Payment intent created successfully"
        };
    }  

    async confirmPayment (userId : string , confirmPaymentDto : ConfirmPaymentDto) : 
     Promise<{
        success : boolean , data : PaymentResponseDto ; message : string
     }>
    {  
        const { paymentIntentId , orderId } = confirmPaymentDto ;  

        const payment = await this.prisma.payment.findFirst({
            where : {
                orderId , 
                userId , 
                transactionId : paymentIntentId 
            } 
        }) ;  

        if (!payment) {
            throw new NotFoundException('payment not found' )
        } 

        if (payment.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException(`Payment already completed for the order id ${orderId}`)
        }

       const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId) 

       if (paymentIntent.status !== 'succeeded') {
           throw new BadRequestException(`Payment not completed for the order id ${orderId}`)
       }

       const [updatePayment] =  await this.prisma.$transaction([
        this.prisma.payment.update({
            where: {id : payment.id} , 
            data : {status : PaymentStatus.COMPLETED} 
        })
       ])  

       this.prisma.order.update({
        where : {id : orderId} , 
        data : {status : 'PROCESSING'} ,  
       }) ; 
        
       const order = await this.prisma.order.findFirst({
        where : {
            id : orderId , 
        }
       })

      if (order?.cartId) { 
        await this.prisma.cart.update({
            where : {id: order.cartId} , 
            data : {checkedOut : true}
        })
      } 

      return {
        success : true  , 
        data : this.mapToPaymentResponse(updatePayment), 
        message : 'payment confirm  successfully '
      }

    
    } 

    private mapToPaymentResponse (payment :  { 
        id : string ; 
        orderId : string ; 
        amount : any ; 
        userId : string ;
        currency : string ; 
        status : PaymentStatus ; 
        paymentMethod : string | null ; 
        transactionId : string | null ; 
        createdAt : Date ; 
        updatedAt : Date
    }) : PaymentResponseDto {
       return { 
         id : payment.id ,
         orderId : payment.orderId , 
         amount : typeof payment.amount === 'number' ? payment.amount : Number(payment.amount) , 
         userId : payment.userId ,
         currency : payment.currency , 
         status : payment.status , 
         paymentMethod : payment.paymentMethod , 
         transactionId : payment.transactionId , 
         createdAt : payment.createdAt , 
         updatedAt : payment.updatedAt 
       }
    } 

    async findAll (userId : string) :Promise<{
        success : boolean ; 
        data : PaymentResponseDto[] ;
        message : string 
    }> {

        const payments = await this.prisma.payment.findMany({
            where : {
                userId 
            }  , 
            orderBy : { createdAt : "desc"}
        }) ;  
         
      return {
        success : true , 
        data : payments.map(this.mapToPaymentResponse) , 
        message : 'Payments fetched successfully '
      }  
    }  

    async getPaymentById (userId : string , id : string) : Promise<{
        success : boolean ; 
        data : PaymentResponseDto ;
        message : string 
    }> {
        const payment = await this.prisma.payment.findFirst({
            where : {
                userId , 
                id 
            }  
        }) ;

        if (!payment) {
            throw new NotFoundException('payment not found')
        } 

        return {
            success : true ,
            data : this.mapToPaymentResponse(payment) , 
            message : 'Payment fetched successfully '
        }  
    } 

    async getPaymentByOrderId (userId : string , orderId : string) : Promise<{
        success : boolean ; 
        data : PaymentResponseDto ;
        message : string 
    }> {
        const payment = await this.prisma.payment.findFirst({
            where : {
                userId , 
                orderId 
            }  
        }) ;

        if (!payment) {
            throw new NotFoundException('payment not found')
        } 

        return {
            success : true ,
            data : this.mapToPaymentResponse(payment) , 
            message : 'Payment fetched successfully '
        }  
    } 
}
