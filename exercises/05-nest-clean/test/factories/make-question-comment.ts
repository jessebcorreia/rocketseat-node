import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  // Partial transforma cada uma das propriedades de QuestionProps em opcionais
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questionComment
}

@Injectable() // É injetado no moduleRef, nos testes do NestJS
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })

    return questionComment
  }
}
