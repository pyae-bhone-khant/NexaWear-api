import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export class OrderApiResponseDto<T> { 
    
    @ApiProperty ({
        description : 'Indicates if the request was successfully'
    })
    success : boolean  

    @ApiProperty ({ 
     description : "Returned Data " , 
     type : Object
    }) 
    data : T 

    @ApiProperty({
      description : "Optional message " , 
      nullable : true , 
      required : false
    }) 
    message : string
} 

export class OrderItemResponseDto { 
    @ApiProperty()
    id : string 
    
    @ApiProperty()
    productId : string 
   
    @ApiProperty()
    productName : string ;  

    @ApiProperty()
    quantity : number
    
    @ApiProperty()
    price : number 

    @ApiProperty()
    subtotal : number  

    @ApiProperty()
    createdAt : Date 

    @ApiProperty()
    updatedAt : Date 
}

export class OrderResponseDto { 
    @ApiProperty()
    id : string  
    
    @ApiProperty()
    userId : string 
    
    @ApiProperty()
    status : string  
  
     @ApiProperty()
    total : number
    
    @ApiProperty()
    shippingAddress : string 
     
    @ApiProperty({ 
        type : [OrderItemResponseDto] ,
        description : "Order Items"
    })
     items : OrderItemResponseDto[]  

    @ApiProperty()
    createdAt : Date 

    @ApiProperty()
    updatedAt : Date 
    
} 
export class PaginatedOrderResponseDto { 
    @ApiProperty({
    type : [OrderResponseDto] , 
    description : "Order Response Dto" 
    })
    data : OrderResponseDto[]
   
    @ApiProperty()
    total : number  

    @ApiProperty()
    page : number 

    @ApiProperty()
    limit : number
}