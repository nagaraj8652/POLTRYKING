import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  userID;
  constructor() { }

  setUserID(userID){
    this.userID = userID;
  }
  
  getUserID(){
    return this.userID;
  }
}
