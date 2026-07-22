import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} 

  // Register Api 
  @Post('register')
  async register(@Body() registerDto : RegisterDto ) : Promise<AuthResponseDto> {
      return this.authService.register(registerDto) ;
  } 

  // Refresh access token 
  @UseGuards()
  async refresh() {

  }
}
 

