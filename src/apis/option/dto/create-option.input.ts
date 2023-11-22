import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
  @Field(() => String)
  option_content: string;

  @Field(() => String, { nullable: true })
  option_description: string;

  @Field(() => Int)
  score: number;

  @Field(() => String)
  question_id: string;
}
