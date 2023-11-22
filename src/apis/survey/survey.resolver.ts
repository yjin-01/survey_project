import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { CreateSurveyInput } from './dto/create-survey.input';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';
import { UpdateSurveyInput } from './dto/update-survey.input';

@Resolver()
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey])
  fetchSurveyAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Query(() => Survey)
  fetchSurvey(@Args('surveyId') survey_id: string): Promise<Survey> {
    return this.surveyService.findOne({ survey_id });
  }

  @Query(() => [Survey])
  fetchFinishedSurvey(): Promise<Survey[]> {
    return this.surveyService.findFinishedSurvey();
  }

  @Mutation(() => Survey)
  createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput, //
  ): Promise<Survey> {
    return this.surveyService.create({ createSurveyInput });
  }

  @Mutation(() => Survey)
  updateSurvey(
    @Args('surveyId') survey_id: string,
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInput, //
  ): Promise<Survey> {
    return this.surveyService.update({ survey_id, updateSurveyInput });
  }

  @Mutation(() => Boolean)
  deleteSurvey(@Args('surveyId') survey_id: string): Promise<boolean> {
    return this.surveyService.delete({ survey_id });
  }

  @Mutation(() => Survey)
  submitSurvey(
    @Args('surveyId') survey_id: string, //
  ): Promise<Survey> {
    return this.surveyService.submit({ survey_id });
  }
}
