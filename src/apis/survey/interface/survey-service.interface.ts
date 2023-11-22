import { CreateSurveyInput } from '../dto/create-survey.input';
import { UpdateSurveyInput } from '../dto/update-survey.input';

export interface ISurveyServiceFindOne {
  survey_id: string;
}

export interface ISurveyServiceCreate {
  createSurveyInput: CreateSurveyInput;
}

export interface ISurveyServiceDelete {
  survey_id: string;
}

export interface ISurveyServiceUpdate {
  survey_id: string;
  updateSurveyInput: UpdateSurveyInput;
}

export interface ISurveyServiceSubmit {
  survey_id: string;
}
