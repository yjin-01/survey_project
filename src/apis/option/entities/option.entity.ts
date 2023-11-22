import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Question } from 'src/apis/question/entities/question.entity';
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
export class Option {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  option_id: string;

  @Column()
  @Field(() => String)
  option_content: string;

  @Column({ nullable: true })
  @Field(() => String)
  option_description: string;

  @Column()
  @Field(() => Int)
  score: number;

  @CreateDateColumn()
  @Field(() => Date)
  reg_date: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  mod_date: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  del_date: Date;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @Field(() => Question)
  question: Question;
}
