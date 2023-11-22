import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => String)
  survey_id: string;

  @Field(() => String)
  question_id: string;

  @Field(() => [String])
  options: string[];
}
