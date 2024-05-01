import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Mission } from 'src/mission/entities/mission.entity';

export const MissionInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Mission => {
    const request = ctx.switchToHttp().getRequest();

    if (!request || !request.params || !request.params.missionId) {
      // missionId가 없는 경우 null 반환
      return null;
    }

    return request.mission ? request.mission : null;
  },
);
