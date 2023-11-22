import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { SurveyModule } from '../survey/survey.module';
import { QuestionModule } from '../question/question.module';
import { OptionModule } from '../option/option.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer]),
    forwardRef(() => SurveyModule),
    QuestionModule,
    OptionModule,
  ],
  providers: [AnswerResolver, AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
