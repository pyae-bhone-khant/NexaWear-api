import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh.token.guards.ts.guard';
import { GetUser } from 'src/coomon/decorators/get-user.decorators';
import { JwtAuthGuard } from 'src/coomon/guards/jwt-auth.guards.ts.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} 

  // Register Api 
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto : RegisterDto ) : Promise<AuthResponseDto> {
      return this.authService.register(registerDto) ;
  } 

  // Refresh access token 
  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  async refresh( @GetUser('id') userId : string) : Promise<AuthResponseDto> {
    return this.authService.refreshToekn(userId);
  }  

  // Logout  user and invalidate refresh Token 
  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard ) 
  async Logout(@GetUser('id') userId  : string) : Promise<{message : string}> { 
     await this.authService.Logout(userId)
     return {message : "Logout successfully "} 
  }

  @Post('login')
  @HttpCode(200)
async login (@Body()  loginDto : LoginDto ) { 
  return await this.authService.Login(loginDto)
} 


}
 

