import { CanActivate, ExecutionContext, Injectable, SetMetadata, mixin } from '@nestjs/common'
import { Role } from '../../../types/enum'
import { createParamDecorator } from '@nestjs/common'
import { GoogleCalendarService } from '../../google-calendar/gcanlendar.service'
import { ExceptionForbidden } from '../../../exception'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req['user']
})

export const RoleGuard = (roles: Role[]) => {
  class Guard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      return roles.includes(request?.user?.role)
    }
  }
  return mixin(Guard)
}

export const PermisionUpdate = () => {
  @Injectable()
  class Guard implements CanActivate {
    constructor(private readonly calendarService: GoogleCalendarService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      if ([Role.ADMIN, Role.DIRECTOR, Role.MANAGER].includes(request.user.role_name)) return true

      const event = await this.calendarService.getCalendarEventByIdService(request.params.eventId)

      if (!event) throw new ExceptionForbidden('Event not found')

      if (event?.extendedProperties?.private?.creator_id === request.user.id) return true

      throw new ExceptionForbidden('You do not have permission to update this event')
    }
  }
  return mixin(Guard)
}
