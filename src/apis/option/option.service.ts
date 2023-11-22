import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
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
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>, //

    private readonly questionService: QuestionService,
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

  findByQuestion({
    question_id,
  }: IOptionServiceFindByQuestion): Promise<Option> {
    return this.optionRepository.findOne({
      where: { question: { question_id } },
      order: { reg_date: 'DESC' },
    });
  }

  async create({ createOptionInput }: IOptionServiceCreate): Promise<Option> {
    const { question_id, ...restInput } = createOptionInput;

    // 문항ID 유무 조회
    const question = await this.questionService.findOne({ question_id });

    // 존재하지 않으면 에러 처리
    if (!question)
      throw new NotFoundException('존재하지않는 설문문항ID입니다.');

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

    if (!Option) throw new NotFoundException('존재하지않는 답변ID입니다.');

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

    if (!option) throw new NotFoundException('존재하지않는 설문 문항입니다.');

    const deleteResult = await this.optionRepository.softDelete({
      option_id,
    });

    return deleteResult.affected ? true : false;
  }
}
