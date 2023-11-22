import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSurveyInput {
  @Field(() => String)
  survey_title: string;

  @Field(() => String)
  survey_description: string;
}
