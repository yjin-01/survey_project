import { CreateAnswerInput } from '../dto/create-answer.input';
import { DeleteAnswerInput } from '../dto/delete-answer.input';
import { UpdateAnswerInput } from '../dto/update-answer.input';

export interface IAnswerServiceFindOne {
  answer_id: string;
}

export interface IOptionServiceFindByQuestion {
  question_id: string;
}

export interface IAnswerServiceCreate {
  createAnswerInput: CreateAnswerInput;
}

export interface IAnswerServiceDelete {
  deleteAnswerInput: DeleteAnswerInput;
}

export interface IAnswerServiceUpdate {
  updateAnswerInput: UpdateAnswerInput;
}

export interface IOptionServiceTotalScore {
  survey_id: string;
}
