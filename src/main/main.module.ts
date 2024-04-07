import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from 'src/mission/entities/mission.entity';
import { MainService } from './main.service';
import { MainController } from './main.controller';

@Module({
    imports : [TypeOrmModule.forFeature([Mission])],
    providers: [MainService],
    controllers: [MainController],
})
export class MainModule {}
