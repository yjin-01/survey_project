import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Option } from './entities/option.entity';
import { OptionService } from './option.service';
import { CreateOptionInput } from './dto/create-option.input';
import { UpdateOptionInput } from './dto/update-option.input';

@Resolver()
export class OptionResolver {
  constructor(private readonly optionService: OptionService) {}

  @Query(() => [Option])
  fetchOptionAll(): Promise<Option[]> {
    return this.optionService.findAll();
  }

  @Query(() => Option)
  fetchOption(@Args('optionId') option_id: string): Promise<Option> {
    return this.optionService.findOne({ option_id });
  }

  // 문항별 선택지 조회
  @Query(() => [Option])
  fetchOptionByQuestion(
    @Args('questionId') question_id: string,
  ): Promise<Option[]> {
    return this.optionService.findOptionByQuestion({ question_id });
  }

  @Mutation(() => Option)
  createOption(
    @Args('createOptionInput') createOptionInput: CreateOptionInput, //
  ): Promise<Option> {
    return this.optionService.create({ createOptionInput });
  }

  @Mutation(() => Option)
  updateOption(
    @Args('optionId') option_id: string,
    @Args('updateOptionInput') updateOptionInput: UpdateOptionInput, //
  ): Promise<Option> {
    return this.optionService.update({
      option_id,
      updateOptionInput,
    });
  }

  @Mutation(() => Boolean)
  deleteOption(@Args('optionId') option_id: string): Promise<boolean> {
    return this.optionService.delete({ option_id });
  }
}
