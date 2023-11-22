import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyResolver } from './survey.resolver';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';
import { QuestionModule } from '../question/question.module';
import { AnswerModule } from '../answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey]), //
    forwardRef(() => QuestionModule),
    forwardRef(() => AnswerModule),
  ],
  providers: [SurveyResolver, SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
