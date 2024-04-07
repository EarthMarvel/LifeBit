import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/board/types/category_status.enum';
import { Mission } from 'src/mission/entities/mission.entity';
import { MissionType } from 'src/mission/types/missionType';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {

    constructor(
        @InjectRepository(Mission)
        private readonly missionRepository : Repository<Mission>
    ) {}

    /**
     * 메인 조회
     * @param category 
     * @param sort 
     * @param title 
     */
    async main(category: Category, sort: string, title: string, type: MissionType) {

        let query = this.missionRepository.createQueryBuilder('mission');

        if (title) query = query.andWhere('mission.title like :title', { title: `%${title}%`});
        if (category) query = query.andWhere('mission.category = :category', {category});
        if (type) query = query.andWhere('mission.type = :type', { type }); 

        if (sort && sort.toUpperCase() === 'ASC') query.orderBy('mission.created_at', 'ASC');
        if (sort && sort.toUpperCase() === 'DESC') query.orderBy('mission.created_at', 'DESC');

        return await query.getMany();
    }
}
