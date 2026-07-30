import  {Injectable, UnauthorizedException} from  '@nestjs/common' ; 
import { PassportStrategy, } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import  {Strategy , ExtractJwt} from 'passport-jwt' 
 
@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy) {
    private prismaService: PrismaService;

    constructor(prisma: PrismaService, configService: ConfigService) {
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() , 
            ignoreExpiration : false , 
            secretOrKey : configService.get<string>('JWT_SECRET') ?? "defaultsecret2026jjdnjdnjkdjkh3err3jjjallkznfnkenjee3eeenj3n" 
        });

        this.prismaService = prisma;
    } 

    // validate  JWT  payload  

    async validate(payload : {sub : string , email : string }) { 
        const user = await this.prismaService.user.findUnique({
            where : {
                id : payload.sub
            } , 
            select : {
                id : true ,
                email : true ,
                firstName : true ,
                lastName : true ,
                role : true 
            }
        }); 

        if (!user) {
            throw new UnauthorizedException('User Not found');
        }

        return user; 
    }
}