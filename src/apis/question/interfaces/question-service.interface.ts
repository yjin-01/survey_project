import { CreateQuestionInput } from '../dto/create-question.input';
import { UpdateQuestionInput } from '../dto/update-question.input';

export interface IQuestionServiceFindOne {
  question_id: string;
}

export interface IQuestionServiceFindBySurvey {
  survey_id: string;
}

export interface IQuestionServiceCreate {
  createQuestionInput: CreateQuestionInput;
}

export interface IQuestionServiceDelete {
  question_id: string;
}

export interface IQuestionServiceUpdate {
  question_id: string;
  updateQuestionInput: UpdateQuestionInput;
}
