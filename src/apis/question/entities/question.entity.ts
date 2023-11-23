import { Field, ObjectType } from '@nestjs/graphql';
import { Survey } from 'src/apis/survey/entities/survey.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  question_id: string;

  @Column()
  @Field(() => String)
  question_content: string;

  @Column({ nullable: true })
  @Field(() => String)
  question_description: string;

  @Column({ nullable: true, default: 0 })
  @Field(() => Boolean)
  is_duplicate_option: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  reg_date: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  mod_date: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  del_date: Date;

  @ManyToOne(() => Survey)
  @Field(() => Survey)
  survey: Survey;
}
