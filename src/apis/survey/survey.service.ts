import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ISurveyServiceCreate,
  ISurveyServiceDelete,
  ISurveyServiceFindOne,
  ISurveyServiceSubmit,
  ISurveyServiceUpdate,
} from './interface/survey-service.interface';
import { Survey } from './entities/survey.entity';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>, //

    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,

    @Inject(forwardRef(() => AnswerService))
    private readonly answerService: AnswerService,
  ) {}

  findOne({ survey_id }: ISurveyServiceFindOne): Promise<Survey> {
    return this.surveyRepository.findOne({
      where: { survey_id },
    });
  }

  findFinishedSurvey(): Promise<Survey[]> {
    return this.surveyRepository
      .createQueryBuilder('survey')
      .where('survey.submit_date IS NOT NULL')
      .getMany();
  }

  findAll(): Promise<Survey[]> {
    return this.surveyRepository.find({
      order: { reg_date: 'DESC' },
    });
  }

  async create({ createSurveyInput }: ISurveyServiceCreate): Promise<Survey> {
    const createResult = await this.surveyRepository.save({
      ...createSurveyInput,
    });

    return createResult;
  }

  async update({
    survey_id, //
    updateSurveyInput,
  }: ISurveyServiceUpdate): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { survey_id },
    });

    if (!survey) throw Error('존재하지않는 설문ID입니다.');

    const updateResult = await this.surveyRepository.save({
      ...survey,
      ...updateSurveyInput,
    });

    return updateResult;
  }

  async delete({ survey_id }: ISurveyServiceDelete): Promise<boolean> {
    const deleteResult = await this.surveyRepository.softDelete({
      survey_id,
    });

    return deleteResult.affected ? true : false;
  }

  async submit({ survey_id }: ISurveyServiceSubmit): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { survey_id },
    });

    if (!survey) throw Error('존재하지않는 설문ID입니다.');

    // 답변 총점
    const score = await this.answerService.totalScore({ survey_id });

    // 설문지별 문항 확인
    const submitResult = await this.surveyRepository.save({
      ...survey,
      submit_date: new Date(),
      answer_score: score,
    });

    return submitResult;
  }
}
