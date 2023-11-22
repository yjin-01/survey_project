import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  question_content: string;

  @Field(() => String, { nullable: true })
  question_description: string;

  @Field(() => Boolean, { nullable: true })
  is_duplicate_option: boolean;

  @Field(() => String)
  survey_id: string;
}
