import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteAnswerInput {
  @Field(() => [String])
  answers: string[];
}
