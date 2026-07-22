import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  private readonly SALT = 12;
  constructor(private  prisma: PrismaService , private jwtService : JwtService ) {}

  // Register a New User
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    const exitingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exitingUser) {
      throw new ConflictException('User with this email already exist .');
    }

    try {
      const hashPassWord = await bcrypt.hash(password, this.SALT);
      const user = await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashPassWord,
        },

        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          password: false,
        },
      });

      const tokens = await this.generateTokens(user.id, user.email);
       await this.updateRefreshToken(user.id , tokens.refreshToken)

       return {
         ...tokens , 
         user
       }

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
      "An error occurred during registration"
      );
    }
  }
  //  Generate access token and refresh token
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> { 
   const payload  = {sub : userId , email}
   const refreshId = randomBytes(16).toString('hex')
   const [accessToken , refreshToken ] = await  Promise.all([
      this.jwtService.signAsync(payload , {expiresIn : "15m"}) , 
      this.jwtService.signAsync({...payload , refreshId , expiresIn : "7d"})
   ])

   return {accessToken , refreshToken }
  }

  // Update refreshToken in the database 
  async updateRefreshToken(userId : string , refreshToken : string ) : Promise<void> {
    await this.prisma.user.update({
      where : {id : userId} , 
      data : {refreshToken} 
    }
    )
  }
}
