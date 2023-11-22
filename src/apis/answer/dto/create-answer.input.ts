import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  survey_id: string;

  @Field(() => String)
  question_id: string;

  @Field(() => [String])
  options: string[];
}
