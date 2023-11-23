import { Field, ObjectType } from '@nestjs/graphql';
import { Option } from 'src/apis/option/entities/option.entity';
import { Question } from 'src/apis/question/entities/question.entity';
import { Survey } from 'src/apis/survey/entities/survey.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  answer_id: string;

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

  @ManyToOne(() => Question)
  @Field(() => Question)
  question: Question;

  @ManyToOne(() => Option)
  @Field(() => Option)
  option: Option;
}
