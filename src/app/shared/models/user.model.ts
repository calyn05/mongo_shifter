export class UserModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissions: string;
  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    permissions: string = '647394df6f67c41cedddb85c'
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.permissions = permissions;
  }
}
