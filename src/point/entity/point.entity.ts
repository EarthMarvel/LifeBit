import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : 'point'})
export class Point {

    @PrimaryGeneratedColumn()
    pointId : number;

    //임의 userId 추후 user 와 연동
    @Column({type : 'varchar', nullable : false})
    userId : number;

    @Column()
    point : number;

    @CreateDateColumn() 
    createdAt: Date;
    
    @UpdateDateColumn() 
    updatedAt: Date;
}