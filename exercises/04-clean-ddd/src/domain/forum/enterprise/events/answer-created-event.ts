import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class AnswerCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.occurredAt = new Date()
    this.answer = answer
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
