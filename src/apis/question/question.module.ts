import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';
import { SurveyModule } from '../survey/survey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]), //
    forwardRef(() => SurveyModule),
  ],
  providers: [QuestionResolver, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
