import { CreateOptionInput } from '../dto/create-option.input';
import { UpdateOptionInput } from '../dto/update-option.input';

export interface IOptionServiceFindOne {
  option_id: string;
}

export interface IOptionServiceFind {
  question_id: string;
  options: string[];
}

export interface IOptionServiceFindByQuestion {
  question_id: string;
}

export interface IOptionServiceCreate {
  createOptionInput: CreateOptionInput;
}

export interface IOptionServiceDelete {
  option_id: string;
}

export interface IOptionServiceUpdate {
  option_id: string;
  updateOptionInput: UpdateOptionInput;
}
