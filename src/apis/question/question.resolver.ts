import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Query(() => [Question])
  fetchQusetionAll(): Promise<Question[]> {
    return this.questionService.findAll();
  }

  @Query(() => Question)
  fetchQuestion(@Args('questionId') question_id: string): Promise<Question> {
    return this.questionService.findOne({ question_id });
  }

  @Query(() => [Question])
  fetchQuestionBySurvey(
    @Args('surveyId') survey_id: string,
  ): Promise<Question[]> {
    return this.questionService.findQuestionBySurvey({ survey_id });
  }

  @Mutation(() => Question)
  createQusetion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput, //
  ): Promise<Question> {
    return this.questionService.create({ createQuestionInput });
  }

  @Mutation(() => Question)
  updateQusetion(
    @Args('questionId') question_id: string,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput, //
  ): Promise<Question> {
    return this.questionService.update({ question_id, updateQuestionInput });
  }

  @Mutation(() => Boolean)
  deleteQusetion(@Args('questionId') question_id: string): Promise<boolean> {
    return this.questionService.delete({ question_id });
  }
}
