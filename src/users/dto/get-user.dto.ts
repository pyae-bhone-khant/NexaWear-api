import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { Role } from "generated/prisma/enums"
import { ApiProperty } from "@nestjs/swagger"

export class GetUserDto { 
    @ApiProperty({
        example : "123e4567-e89b-12d3-a456-426614174000" , 
        description : "User ID"  
    })
    @IsString()
    id : string  
    
    @ApiProperty({
        example : "[EMAIL_ADDRESS]" , 
        description : "User Email" 
    })
    @IsEmail()
    @IsNotEmpty()
    email : string 
     
    @ApiProperty({
        example : "John" , 
        description : "User FirstName" ,
        nullable : true
    })
    @IsString()
    @IsNotEmpty()
    firstName : string  | null
    
    @ApiProperty({
        example : "Doe" , 
        description : "User LastName" ,
        nullable : true
    })
    @IsString()
    @IsNotEmpty()
    lastName : string | null
 
     
    @ApiProperty({
        example : "ADMIN" , 
        description : "User Role" 
    }) 
    role : Role; 

    @ApiProperty({
        example : "2022-01-01T00:00:00.000Z" , 
        description : "User Created At" 
    }) 
    createdAt : Date ; 
    
    @ApiProperty({
        example : "2022-01-01T00:00:00.000Z" , 
        description : "User Updated At" 
    }) 
    updatedAt : Date ; 
    
}