import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';

export const Roles = (...roles: Role[]) => SetMetadata("ROLE_KEY", roles); 


