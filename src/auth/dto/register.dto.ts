import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength ,  } from "class-validator"


export class RegisterDto {
    @IsEmail({} , {message : "Please provide a valid email address "})
    @IsNotEmpty({message : "Email is required "})
    email : string   

    @IsString({})
    @IsNotEmpty({message : "Password is required "})
    @MinLength(6 , {message : "Password must be at least 6 characters long "})
    @MaxLength(20 , {message : "Password must be at most 20 characters long "})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$])/, {message : "Password must contain at least one lowercase letter , one uppercase letter , one number and one special character "}) 
    password : string ;
    
    @IsString()
    @IsOptional()
    firstName? : string

    @IsString()
    @IsOptional()
    lastName? : string  

}