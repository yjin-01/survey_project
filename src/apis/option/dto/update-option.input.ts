import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateOptionInput {
  @Field(() => String, { nullable: true })
  option_content: string;

  @Field(() => String, { nullable: true })
  option_description: string;

  @Field(() => Int, { nullable: true })
  score: number;
}
