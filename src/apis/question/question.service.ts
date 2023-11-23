import {
  Inject,
  Injectable,
  forwardRef,
  LoggerService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import {
  IQuestionServiceCreate,
  IQuestionServiceDelete,
  IQuestionServiceFindBySurvey,
  IQuestionServiceFindOne,
  IQuestionServiceUpdate,
} from './interfaces/question-service.interface';
import { SurveyService } from '../survey/survey.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>, //

    @Inject(forwardRef(() => SurveyService))
    private readonly surveyService: SurveyService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      order: { reg_date: 'DESC' },
    });
  }

  findOne({ question_id }: IQuestionServiceFindOne): Promise<Question> {
    return this.questionRepository.findOne({
      where: { question_id },
    });
  }

  findQuestionBySurvey({
    survey_id,
  }: IQuestionServiceFindBySurvey): Promise<Question[]> {
    return this.questionRepository.find({
      where: { survey: { survey_id } },
      order: { reg_date: 'DESC' },
    });
  }

  findQuestionIdBySurvey({
    survey_id,
  }: IQuestionServiceFindBySurvey): Promise<Question[]> {
    return this.questionRepository.find({
      where: { survey: { survey_id } },
      order: { reg_date: 'DESC' },
      select: { question_id: true },
    });
  }

  // 중복 응답 가능 여부 확인
  async checkedDuplicateOption({ question_id }) {
    const question = await this.findOne({ question_id });

    if (!question) {
      this.logger.error('[QustionService]', {
        method: 'checkedDuplicateOption',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    return question.is_duplicate_option;
  }

  async create({
    createQuestionInput,
  }: IQuestionServiceCreate): Promise<Question> {
    const { survey_id, ...restInput } = createQuestionInput;

    // 문항ID 유무 조회
    const survey = await this.surveyService.findOne({ survey_id });

    // 존재하지 않으면 에러 처리
    if (!survey) {
      this.logger.error('[QustionService]', {
        method: 'create',
        code: '01',
      });
      throw new HttpException('존재하지 않는 설문ID', HttpStatus.BAD_REQUEST);
    }
    const createResult = await this.questionRepository.save({
      ...restInput,
      survey,
    });

    return createResult;
  }

  async update({
    question_id, //
    updateQuestionInput,
  }: IQuestionServiceUpdate): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { question_id },
    });

    if (!question) {
      this.logger.error('[QustionService]', {
        method: 'update',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateResult = await this.questionRepository.save({
      ...question,
      ...updateQuestionInput,
    });

    return updateResult;
  }

  async delete({ question_id }: IQuestionServiceDelete): Promise<boolean> {
    const question = await this.questionRepository.findOne({
      where: { question_id },
    });

    if (!question) {
      this.logger.error('[QustionService]', {
        method: 'delete',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deleteResult = await this.questionRepository.softDelete({
      question_id,
    });

    return deleteResult.affected ? true : false;
  }
}
