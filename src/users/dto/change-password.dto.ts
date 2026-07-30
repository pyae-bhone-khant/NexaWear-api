import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export class ChangePasswordDto {
    @ApiProperty({
        description : "New password  for the user " , 
        example : 'NewP@ssOrd!'
    })
    @IsString()
    @IsNotEmpty()
    currentPassword  : string 

    @ApiProperty({
        description : "New password  for the user " , 
        example : 'NewP@ssOrd1!'
    })
    @IsString()
    @MinLength(8 ) 
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , {
        message : "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character "
    }) 
    @IsNotEmpty()
    newPassword : string 
}