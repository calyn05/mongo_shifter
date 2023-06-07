export class DbUserModel {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  comments?: Array<any>;
  created: Date;
  updated: Date;
  constructor(
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    comments: Array<string>,
    created: Date,
    updated: Date
  ) {
    this._id = _id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.comments = comments;
    this.created = created;
    this.updated = updated;
  }

  static fromObject(obj: any): DbUserModel {
    return new DbUserModel(
      obj._id,
      obj.email,
      obj.firstName,
      obj.lastName,
      obj.comments,
      obj.created,
      obj.updated
    );
  }

  static fromObjectArray(objArray: any): DbUserModel[] {
    let array: DbUserModel[] = [];
    for (let obj of objArray) {
      array.push(DbUserModel.fromObject(obj));
    }
    return array;
  }
}
