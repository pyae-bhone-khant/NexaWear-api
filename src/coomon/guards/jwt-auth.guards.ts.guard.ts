import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard ('jwt' ) { 
  constructor (private refletor : Reflector) {
    super();
  }

   canActivate(context: ExecutionContext) {
     return super.canActivate(context)
  } 
  
}
