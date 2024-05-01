import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('GetUser : request : ' + request);
    return request.user; // Passport가 요청 객체에 추가한 user 객체를 반환합니다.
  },
);
