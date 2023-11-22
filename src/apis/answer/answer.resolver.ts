import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Answer } from './entities/answer.entity';
import { AnswerService } from './answer.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { DeleteAnswerInput } from './dto/delete-answer.input';

@Resolver()
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Query(() => [Answer])
  fetchAnswerAll(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

  @Query(() => Answer)
  fetchAnswer(@Args('answerId') answer_id: string): Promise<Answer> {
    return this.answerService.findOne({ answer_id });
  }

  // 설문지별 답변 조회
  @Query(() => [Answer])
  fetchAnswerBySurvey(@Args('surveyId') survey_id: string): Promise<Answer[]> {
    return this.answerService.findAnswerBySurvey({ survey_id });
  }

  // 문항별 답변 조회
  @Query(() => [Answer])
  fetchAnswerByQuestion(
    @Args('questionId') question_id: string,
  ): Promise<Answer[]> {
    return this.answerService.findAnswerByQuestion({ question_id });
  }

  @Mutation(() => [String])
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput, //
  ): Promise<string[]> {
    return this.answerService.create({ createAnswerInput });
  }

  @Mutation(() => [String])
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput, //
  ): Promise<string[]> {
    return this.answerService.update({
      updateAnswerInput,
    });
  }

  @Mutation(() => Boolean)
  deleteAnswer(
    @Args('deleteAnswerInput') deleteAnswerInput: DeleteAnswerInput,
  ): Promise<boolean> {
    return this.answerService.delete({ deleteAnswerInput });
  }
}
