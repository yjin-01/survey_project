import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { OptionResolver } from './option.resolver';
import { OptionService } from './option.service';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Option]), //
    QuestionModule,
  ],
  providers: [OptionResolver, OptionService],
  exports: [OptionService],
})
export class OptionModule {}
