import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, In } from 'typeorm';
import { QuestionService } from '../question/question.service';
import { Answer } from './entities/answer.entity';
import {
  IAnswerServiceCreate,
  IAnswerServiceDelete,
  IAnswerServiceFindOne,
  IAnswerServiceUpdate,
  IOptionServiceTotalScore,
} from './interface/answer-service.interface';
import { SurveyService } from '../survey/survey.service';
import { OptionService } from '../option/option.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>, //
    @Inject(forwardRef(() => SurveyService))
    private readonly surveyService: SurveyService,
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
  ) {}

  findAll(): Promise<Answer[]> {
    return this.answerRepository.find({
      order: { reg_date: 'DESC' },
      relations: ['option', 'question', 'survey'],
    });
  }

  findOne({ answer_id }: IAnswerServiceFindOne): Promise<Answer> {
    return this.answerRepository.findOne({
      where: { answer_id },
      relations: ['option', 'question', 'survey'],
    });
  }

  findAnswerBySurvey({ survey_id }): Promise<Answer[]> {
    return this.answerRepository.find({
      where: { survey: { survey_id } },
      order: { reg_date: 'DESC' },
      relations: ['option', 'question'],
    });
  }

  findAnswerIdBySurvey({ survey_id }): Promise<Answer[]> {
    return this.answerRepository.find({
      where: { survey: { survey_id } },
      order: { reg_date: 'DESC' },
      relations: ['option', 'question'],
      select: { answer_id: true },
    });
  }

  findAnswerByQuestion({ question_id }): Promise<Answer[]> {
    return this.answerRepository.find({
      where: { question: { question_id } },
      order: { reg_date: 'DESC' },
      relations: ['option'],
    });
  }

  bulkInsert({ insertAnswers }): Promise<InsertResult> {
    return this.answerRepository.insert(insertAnswers);
  }

  async create({ createAnswerInput }: IAnswerServiceCreate): Promise<string[]> {
    const { survey_id, question_id, options } = createAnswerInput;

    // 선택지가 1개가 아닌 경우
    if (options.length != 1) {
      // 중복 응답 가능한 문항인지 체크
      const checkedDuplicateOption =
        await this.questionService.checkedDuplicateOption({
          question_id,
        });

      // 중복 응답이 불가능한 경우 에러 처리
      if (!checkedDuplicateOption) throw new Error();
    }
    // 설문ID 유무 조회
    const survey = await this.surveyService.findOne({ survey_id });

    // 존재하지 않으면 에러 처리
    if (!survey) throw new NotFoundException('존재하지않는 설문문항ID입니다.');

    // 문항ID 유무 조회
    const question = await this.questionService.findOne({ question_id });

    // 존재하지 않으면 에러 처리
    if (!question)
      throw new NotFoundException('존재하지않는 설문문항ID입니다.');

    // 선택지 조회
    const option = await this.optionService.find({
      question_id,
      options,
    });

    const insertAnswers = option.map((el) => {
      return { survey, question, option: el };
    });

    const answers = await this.bulkInsert({ insertAnswers });

    // 등록된 answerId만 return
    const insertIdResult = answers.identifiers.map((el) => {
      return el.answer_id;
    });

    return insertIdResult;
  }

  async update({ updateAnswerInput }: IAnswerServiceUpdate): Promise<string[]> {
    const { survey_id, question_id, options } = updateAnswerInput;

    // 선택지가 1개가 아닌 경우
    if (options.length != 1) {
      // 중복 응답 가능한 문항인지 체크
      const checkedDuplicateOption =
        await this.questionService.checkedDuplicateOption({
          question_id,
        });

      // 중복 응답이 불가능한 경우 에러 처리
      if (!checkedDuplicateOption) throw new Error();
    }
    // 설문ID 유무 조회
    const survey = await this.surveyService.findOne({ survey_id });

    // 존재하지 않으면 에러 처리
    if (!survey) throw new NotFoundException('존재하지않는 설문문항ID입니다.');

    // 문항ID 유무 조회
    const question = await this.questionService.findOne({ question_id });

    // 존재하지 않으면 에러 처리
    if (!question)
      throw new NotFoundException('존재하지않는 설문문항ID입니다.');

    // 문항에 대한 기존 모두 답변 삭제
    const deleteAnswers = await this.answerRepository.softDelete({
      survey: { survey_id },
      question: { question_id },
    });

    // 선택지 조회
    const option = await this.optionService.find({
      question_id,
      options,
    });

    const insertAnswers = option.map((el) => {
      return { survey, question, option: el };
    });

    const answers = await this.bulkInsert({ insertAnswers });

    // 등록된 answerId만 return
    const updateIdResult = answers.identifiers.map((el) => {
      return el.answer_id;
    });

    return updateIdResult;
  }

  async delete({ deleteAnswerInput }: IAnswerServiceDelete): Promise<boolean> {
    const option = await this.answerRepository.find({
      where: { option: In(deleteAnswerInput.answers) },
    });

    if (option.length == 0) throw new BadRequestException();

    const deleteResult = await this.answerRepository.softDelete({
      option: In(deleteAnswerInput.answers),
    });

    return deleteResult.affected ? true : false;
  }
  // 설문지별 답변 총점 구하기

  async totalScore({ survey_id }: IOptionServiceTotalScore): Promise<number> {
    const answers = await this.findAnswerBySurvey({ survey_id });

    const score = answers.reduce((acc, cur) => {
      return acc + cur.option.score;
    }, 0);

    return score;
  }
}
