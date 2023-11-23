import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { SurveyModule } from './apis/survey/survey.module';
import { QuestionModule } from './apis/question/question.module';
import { OptionModule } from './apis/option/option.module';
import { AnswerModule } from './apis/answer/answer.module';

import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { loggerFileOptions } from './commons/logger/logger.option';

@Module({
  imports: [
    WinstonModule.forRoot({
      // options
      transports: [
        // 콘솔로 기록
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(), // 시간 기록
            // Nest방식으로 출력
            utilities.format.nestLike('survey_project', {
              prettyPrint: true,
            }),
          ),
        }),

        // info, warn, error 로그는 파일로 관리
        new winstonDaily(loggerFileOptions('info')),
        new winstonDaily(loggerFileOptions('warn')),
        new winstonDaily(loggerFileOptions('error')),
      ],
    }),

    SurveyModule,
    QuestionModule,
    OptionModule,
    AnswerModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/commons/grahql/schema.gql'),
      formatError: (error) => {
        const formattedError = {
          path: error.path,
          message: error.message,
          code: error.extensions.code,
        };
        return formattedError;
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      // logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
