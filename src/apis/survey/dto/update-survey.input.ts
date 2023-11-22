import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSurveyInput {
  @Field(() => String, { nullable: true })
  survey_title: string;

  @Field(() => String, { nullable: true })
  survey_description: string;
}
