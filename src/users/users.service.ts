import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserDto } from './dto/get-user.dto';
import { GetAllUserDto } from './dto/get-alluser.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt' 

@Injectable()
export class UsersService { 
constructor (private  readonly prisma : PrismaService ) {}
 
async fineOne(userId : string ) : Promise<GetUserDto> {

    try {
        const user = await this.prisma.user.findUnique( 
          {where : {id : userId} ,
            select : { 
                id : true , 
                email : true , 
                firstName : true , 
                lastName : true  , 
                role : true , 
                // password : false ,
                createdAt : true , 
                updatedAt : true 
            }
          }  
          
      ) ;  
    if (!user) { 
       throw new  UnauthorizedException('User not found') 
    } 
    return user;
    } catch (error) {
        throw new BadRequestException('cannot use findone')
    }

}  

/** GetAllUser */
async findAll() : Promise<GetUserDto[]> {
   try { 
    const user = await this.prisma.user.findMany(
      {
        select : { 
                id : true , 
                email : true , 
                firstName : true , 
                lastName : true  , 
                role : true , 
                createdAt : true , 
                updatedAt : true 
            } ,
            orderBy : {createdAt : "desc"}
      }  
    )  


    return user;
   } catch (error) {
    throw new BadRequestException('cannot use findAll')
   }
} 

async update (userId : string , updateUserDto : UpdateUserDto) : Promise<GetUserDto> { 
    
    const exitingUser = await this.prisma.user.findUnique( 
      {where : {id : userId} 
      })
 
      if (!exitingUser) { 
          throw new  UnauthorizedException('User not found') 
        }  
 
        // check if the new email is already used by another user (only if email is being changed )
        if (updateUserDto.email && updateUserDto.email !== exitingUser.email) {
          const emailtaken = await this.prisma.user.findMany({
            where : {email : updateUserDto.email}
          })
          if (emailtaken) {
            throw new  UnauthorizedException('Email is already taken')  
          }

        } 

        const updateUser = await this.prisma.user.update({
            where : {id : userId} , 
            data : updateUserDto , 
            select : {
                id : true , 
                email : true , 
                firstName : true , 
                lastName : true  , 
                role : true , 
                // password : false ,
                createdAt : true , 
                updatedAt : true 
            }
        }) 

        return updateUser
} 
 
  async changePassword (
    userId : string , changePasswordDto : ChangePasswordDto
  ) : Promise<{message : string }> {
     
    const exitingUser = await this.prisma.user.findUnique({
      where : {id : userId} 
    })

    if (!exitingUser) { 
      throw new UnauthorizedException('User not Found ')
    }  

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword , exitingUser.password )

    if (!isMatch) { 
      throw new UnauthorizedException('Invalid current password ')
    } 

    const isnewMatch = await bcrypt.compare(changePasswordDto.newPassword , exitingUser.password )

    if (isnewMatch) { 
      throw new UnauthorizedException('New password cannot be same as current password ')
    }  

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword , 10 )
     
    await this.prisma.user.update({
        where : {id : userId } ,
        data : {password : hashedPassword}
        
    }) 

    return {message : "password change successFully"} ; 

  } 

  async Remove(userId : string ) : Promise<{message : string }> { 
    const exitingUser = await this.prisma.user.findUnique({
      where : {id : userId} 
    }) 

    if (!exitingUser) { 
      throw new UnauthorizedException('User not Found ') 
    }  

    await this.prisma.user.delete({
      where : {id : userId} 
    }) 

    return {message : "Account deleted successfully"} 
  }   
  
}