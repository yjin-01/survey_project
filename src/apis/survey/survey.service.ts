import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
  LoggerService,
} from '@nestjs/common';
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
import { AnswerService } from '../answer/answer.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>, //

    @Inject(forwardRef(() => AnswerService))
    private readonly answerService: AnswerService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

    // 설문지 유무 확인
    if (!survey) {
      this.logger.error('[SurveyService]', { method: 'update', code: '01' });
      throw new HttpException('존재하지 않는 설문ID', HttpStatus.BAD_REQUEST);
    }

    const updateResult = await this.surveyRepository.save({
      ...survey,
      ...updateSurveyInput,
    });

    return updateResult;
  }

  async delete({ survey_id }: ISurveyServiceDelete): Promise<boolean> {
    const survey = await this.surveyRepository.findOne({
      where: { survey_id },
    });

    // 설문지 유무 확인
    if (!survey) {
      this.logger.error('[SurveyService]', { method: 'delete', code: '01' });
      throw new HttpException('존재하지 않는 설문ID', HttpStatus.BAD_REQUEST);
    }

    const deleteResult = await this.surveyRepository.softDelete({
      survey_id,
    });

    return deleteResult.affected ? true : false;
  }

  async submit({ survey_id }: ISurveyServiceSubmit): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { survey_id },
    });

    // 설문지 유무 확인
    if (!survey) {
      this.logger.error('[SurveyService]', { method: 'submit', code: '01' });
      throw new HttpException('존재하지 않는 설문ID', HttpStatus.BAD_REQUEST);
    }
    // 이미 완료된 설문지인 경우 에러 처리
    if (survey.submit_date) {
      this.logger.error('[SurveyService]', { method: 'submit', code: '02' });
      throw new HttpException('이미 완료된 설문', HttpStatus.BAD_REQUEST);
    }
    // 답변 총점
    const score = await this.answerService.totalScore({ survey_id });

    // 제출일, 총점 저장
    const submitResult = await this.surveyRepository.save({
      ...survey,
      submit_date: new Date(),
      answer_score: score,
    });

    return submitResult;
  }
}
