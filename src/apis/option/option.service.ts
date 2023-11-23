import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Option } from './entities/option.entity';
import {
  IOptionServiceCreate,
  IOptionServiceDelete,
  IOptionServiceFind,
  IOptionServiceFindByQuestion,
  IOptionServiceFindOne,
  IOptionServiceUpdate,
} from './interface/option-service.interface';
import { QuestionService } from '../question/question.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>, //

    private readonly questionService: QuestionService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  findAll(): Promise<Option[]> {
    return this.optionRepository.find({
      order: { reg_date: 'DESC' },
    });
  }

  findOne({ option_id }: IOptionServiceFindOne): Promise<Option> {
    return this.optionRepository.findOne({
      where: { option_id },
    });
  }

  // 문항에 맞는 선택지 조회
  async find({ question_id, options }: IOptionServiceFind): Promise<Option[]> {
    const option = await this.optionRepository.find({
      where: { option_id: In(options), question: { question_id } },
    });

    return option;
  }

  findOptionByQuestion({
    question_id,
  }: IOptionServiceFindByQuestion): Promise<Option[]> {
    return this.optionRepository.find({
      where: { question: { question_id } },
      relations: ['question'],
      order: { reg_date: 'DESC' },
    });
  }

  async create({ createOptionInput }: IOptionServiceCreate): Promise<Option> {
    const { question_id, ...restInput } = createOptionInput;

    // 문항ID 유무 조회
    const question = await this.questionService.findOne({ question_id });

    // 존재하지 않으면 에러 처리
    if (!question) {
      this.logger.error('[OptionService]', {
        method: 'create',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createResult = await this.optionRepository.save({
      ...restInput,
      question: question,
    });

    return createResult;
  }

  async update({
    option_id, //
    updateOptionInput,
  }: IOptionServiceUpdate): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { option_id },
    });

    if (!option) {
      this.logger.error('[OptionService]', {
        method: 'update',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 선택지 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateResult = await this.optionRepository.save({
      ...option,
      ...updateOptionInput,
    });

    return updateResult;
  }

  async delete({ option_id }: IOptionServiceDelete): Promise<boolean> {
    const option = await this.optionRepository.findOne({
      where: { option_id },
    });

    if (!option) {
      this.logger.error('[OptionService]', {
        method: 'delete',
        code: '01',
      });
      throw new HttpException(
        '존재하지 않는 설문 문항 선택지 ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deleteResult = await this.optionRepository.softDelete({
      option_id,
    });

    return deleteResult.affected ? true : false;
  }
}
