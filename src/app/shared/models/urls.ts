export class Url {
  static baseUrl: string = 'http://localhost:8080/api';
  // static baseUrl: string = 'https://www.api.calin.codes/api';
  static userBaseUrl: string = `${Url.baseUrl}/user`;
  static commentsBaseUrl: string = `${Url.baseUrl}/comments`;
  static shiftsBaseUrl: string = `${Url.baseUrl}/shifts`;

  constructor(public userUrls: UserUrls) {
    if (process.env['NODE_ENV'] === 'production') {
      Url.baseUrl = 'https://shifter-api.onrender.com/api';
      console.log('Production mode');
    }

    if (process.env['NODE_ENV'] === 'development') {
      Url.baseUrl = 'http://localhost:3000/api';
      console.log('Development mode');
    }
  }

  getBaseUrl() {
    return Url.baseUrl;
  }
}

export class UserUrls extends Url {
  static loginUrl: string = `${Url.userBaseUrl}/login`;
  static registerUrl: string = `${Url.userBaseUrl}/signup`;
  static logoutUrl: string = `${Url.userBaseUrl}/logout`;
  static getUserbyIdUrl: string = `${Url.userBaseUrl}/`;
  static forgotPasswordUrl: string = `${Url.userBaseUrl}/forgotPassword`;
  static resetPasswordUrl: string = `${Url.userBaseUrl}/resetPassword/`;
  static updatePasswordUrl: string = `${Url.userBaseUrl}/updateMyPassword`;
  static updateMeUrl: string = `${Url.userBaseUrl}/updateMe`;
  static deleteMeUrl: string = `${Url.userBaseUrl}/deleteMe`;
  static updateUserByIdUrl: string = `${Url.userBaseUrl}/`;
}

export class CommentsUrls extends Url {
  static getCommentByIdUrl: string = `${Url.commentsBaseUrl}/`;
  static createCommentUrl: string = `${Url.commentsBaseUrl}`;
  static updateCommentByIdUrl: string = `${Url.commentsBaseUrl}/`;
  static getUserCommentsUrl: string = `${Url.commentsBaseUrl}/user/`;
}

export class ShiftsUrls extends Url {
  static getUserShiftsUrl: string = `${Url.shiftsBaseUrl}/user/`;
  static getShiftByIdUrl: string = `${Url.shiftsBaseUrl}/`;
  static createShiftUrl: string = `${Url.shiftsBaseUrl}`;
  static updateShiftByIdUrl: string = `${Url.shiftsBaseUrl}/`;
  static getShiftsByLocationUrl: string = `${Url.shiftsBaseUrl}/location/`;
}

export class AdminUrls extends UserUrls {
  static getAllUsersUrl: string = `${Url.userBaseUrl}`;
  static deleteUserUrl: string = `${Url.userBaseUrl}/`;

  static getAllCommentsUrl: string = `${Url.commentsBaseUrl}`;
  static deleteCommentUrl: string = `${Url.commentsBaseUrl}/`;

  static getAllShiftsUrl: string = `${Url.shiftsBaseUrl}`;
  static deleteShiftUrl: string = `${Url.shiftsBaseUrl}/`;
  static getShiftsByDateUrl: string = `${Url.shiftsBaseUrl}/date/`;

  static permissionsBaseUrl: string = `${Url.baseUrl}/permissions`;
}
