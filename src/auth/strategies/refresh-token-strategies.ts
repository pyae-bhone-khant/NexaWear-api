// Refresh Token Strategy 

import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";

import { Strategy } from "passport-jwt";

import { PrismaService } from "src/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy , 'jwt-refresh') {
    constructor( private configService : ConfigService , private prisma : PrismaService ) {
      super({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() ,
        ignoreExpiration : false , 
        secretOrKey : configService.get<string>('JWT_REFRESH_SECRET' , "defaultsecret2026kjffdjfjejjdnjdnjkdjkh3err3jjjallkznfnkenjee3eeenj3n") , 
        passReqToCallback : true 
      })
    }
    
    // validate refresh token 
    async validate(req : Request  , payload : {sub : string , email : string}) { 
        console.log("RefreshTokenStrategy.validate called"); 
        console.log("Payload" , {sub : payload.sub , email : payload.email})
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("No authorization header found")
            throw new UnauthorizedException('Refresh Token not provided ') ; 

        } 

        const refreshToken = authHeader.replace('Bearer ' , '').trim() ; 
       if (!refreshToken) {
       throw new UnauthorizedException("Refresh token is empty after extration ")
       }
         
    const user = await this.prisma.user.findUnique({
       where : {
         id  : payload.sub 
       } , 
       select : {
        id : true , 
        email : true , 
        role : true , 
        refreshToken  : true , 
       }
    }) 

    if (!user || !user.refreshToken) { 
      console.log("No user found ")
      throw new UnauthorizedException('Invalid refresh token ')
    }

   const refreshTokenMatches  = await bcrypt.compare(refreshToken , user.refreshToken) 

   if (!refreshTokenMatches) { 
    throw new UnauthorizedException('Invalid refresh does  not matcch ')
   }
  
   return {id : user.id , email : user.email , role : user.role }
    }
}