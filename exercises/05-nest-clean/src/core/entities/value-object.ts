import { UniqueEntityID } from './unique-entity-id';

export abstract class ValueObject<T> {
  private _id: UniqueEntityID;
  protected props: T;

  get id() {
    return this._id;
  }

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID(id);
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
