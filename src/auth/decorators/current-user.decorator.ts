import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const CurrentUser = createParamDecorator (
    (data: never, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        console.info(request.session.userId);
        return request.currentUser
    }
)