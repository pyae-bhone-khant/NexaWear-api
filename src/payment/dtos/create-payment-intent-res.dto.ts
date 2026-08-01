import { ApiOperation, ApiProperty } from "@nestjs/swagger";


export class PaymentResponseDto { 
    @ApiProperty({
        example : "ekjdejfifejri3jrij3ij44i343f"
    })
    id : string  
     

    @ApiProperty({ 
        example : 'order-123'
    })
    orderId : string  


    @ApiProperty({
        example : 10000 
    })
    amount : number 

    @ApiProperty({
        example : 'ejrejkwjei3nkjdierfenkr'
    })
    userId : string  
    
    @ApiProperty({
        example : 'usd'
    })
    currency : string 

    @ApiProperty({
        example : 'COMPLETED',
        enum : ['PENDING' , 'COMPLETED' , 'FAILED' , 'CANCELLED']

    }) 
    status : string  
    
    @ApiProperty({
        example : 'card' , 
        nullable : true
    })
    paymentMethod : string | null 
  
    @ApiProperty({
        example : 'Pi_123434345456546546' , 
        nullable : true
    })
    transactionId : string | null  

   
    @ApiProperty({
        type : 'string' , 
        format : 'date-time' , 
    })
    createdAt : Date 

    @ApiProperty({
        type : 'string' , 
        format : 'date-time' , 
    })
    updatedAt : Date

    
    
} 
export class CreatePaymentIntentResponse { 
    @ApiProperty({
        example : 'pi_123434345456546546_secret_sdkjfjkeifjrijrfj'  , 
        description : 'Stripe client secret for payment confirmation '
    })
    clientSecret : string  
   
    @ApiProperty({
        example : 'pm_123434345456546546' ,
        description : 'payment method id ' 
    }) 
    paymentId : string  


} 


export class CreatePaymentIntentApiResponeDto {
    
    @ApiProperty({
        example : true
    })
    success : boolean 
    
    @ApiProperty({
        type : CreatePaymentIntentResponse , 
    })
    data : CreatePaymentIntentResponse 
    
     @ApiProperty({
         example : "Payment create successfuly " , 
         required : false
     })
    message : string 


}