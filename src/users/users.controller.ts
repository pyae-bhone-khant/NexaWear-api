import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { Role } from 'generated/prisma/enums';
import { RoleGuard } from 'src/coomon/guards/role.guard';
import { GetUserDto } from './dto/get-user.dto';
import { RequestWithUser } from 'src/coomon/interface/request-with-user-interface';
import { Roles } from 'src/coomon/decorators/roles.decorator.ts.decorator';
import { GetAllUserDto } from './dto/get-alluser.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import path from 'path';
import { GetUser } from 'src/coomon/decorators/get-user.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT_Auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 @Get("/me") 
 @ApiResponse({
  status : 200 , 
  description : 'The current user profile ' , 
  type : GetUserDto 
 }) 
 async getUserProfile(@Req() req : RequestWithUser) : Promise<GetUserDto> {
    return this.usersService.fineOne(req.user.id)  
 }  

 /**Get All User  */ 
 @Get()
 @ApiResponse({
   description : "Get All User" ,
   type : GetUserDto,
   status : 200 
 }) 
 @Roles(Role.ADMIN)
 async GetAllUser()  : Promise<GetUserDto[]>{
  return this.usersService.findAll()
 }  


 /**Get user by id  (Admin only)*/
 @Get(":id")
 @ApiResponse({
  status : 200 , 
  description : 'The current user profile ' , 
  type : GetUserDto 
 })
 async getUserById(@Param("id") id : string) : Promise<GetUserDto> {
    return this.usersService.fineOne(id)
 }  

 /**update userBy id (Admin and user  only )*/
 @Patch(":id")
 @ApiResponse({
  status : 200 , 
  description : 'The current user profile ' , 
  type : GetUserDto 
 })
 async UpdateUser( @Param("id") userId : string , @Body() updateUserDto : UpdateUserDto) : Promise<GetUserDto> { 
    return this.usersService.update(userId , updateUserDto) 
 }

 @Patch('me/password')
 @HttpCode(201)
 @ApiOperation({summary : "Change Current user password "})
 @ApiResponse({
   status : 201 ,
   description : "Password changed successfully" ,
   type : GetUserDto 
 })
 @ApiResponse({
   status : 400 ,
   description : " Bad request "
 })
 @ApiResponse({
   status : 404 ,
   description : " Not found "
 })
 @ApiResponse({
   status : 500 ,
   description : " Internal server error "
 })
 async updatePassword(
  @GetUser('id') userId : string , 
  @Body() changePassword : ChangePasswordDto
 ) { 
  return await this.usersService.changePassword(userId , changePassword)
 } 

 /**delete currentUser account  */ 
 @Delete('/me')
 @ApiResponse({
  status : 200 , 
  description : 'The current user account has been deleted successfully ',
  type : GetUserDto 
 })
 @Roles(Role.ADMIN)
 async deleteAccount(@GetUser('id') userId : string ) : Promise<{message : string }> { 
  return this.usersService.Remove(userId) 
 } 
}
