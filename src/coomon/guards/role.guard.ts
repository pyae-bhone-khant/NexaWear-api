import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class RoleGuard implements CanActivate {
 constructor ( private refletor : Reflector ) {}
   canActivate(
    context: ExecutionContext,
  ): boolean {
    
    const reruiredRole = this.refletor.getAllAndOverride<Role[]>( "ROLE_KEY" , [
    context.getHandler() , 
    context.getClass() 
    ])  
if (!reruiredRole) {
  return true
}
 const {user} = context.switchToHttp().getRequest();
 return reruiredRole.some((role) => user.role === role)
  }
}
