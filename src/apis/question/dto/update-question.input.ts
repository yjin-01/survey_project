import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput {
  @Field(() => String, { nullable: true })
  question_content: string;

  @Field(() => String, { nullable: true })
  question_description: string;

  @Field(() => Boolean, { nullable: true })
  is_duplicate_option: boolean;
}
