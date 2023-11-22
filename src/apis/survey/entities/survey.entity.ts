import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  survey_id: string;

  @Column()
  @Field(() => String)
  survey_title: string;

  @Column({ nullable: true })
  @Field(() => String)
  survey_description: string;

  @Column({ nullable: true })
  @Field(() => Date)
  submit_date: Date;

  @Column({ nullable: true })
  @Field(() => Int)
  answer_score: number;

  @CreateDateColumn()
  @Field(() => Date)
  reg_date: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  mod_date: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  del_date: Date;
}
