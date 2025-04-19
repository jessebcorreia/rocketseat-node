import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"

interface QuestionsProps {
  title: string,
  content: string,
  slug: Slug,
  authorId: string
}

export class Question extends Entity<QuestionsProps> {

}