import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  uesrID : any;
  userDetails: any;

  constructor(private globalService: GlobalService, private storage: Storage, private router : Router) {
    this.storage.get('userId').then((val) => {
      if(!val){
        this.router.navigate(['/login']);
      }else{
        this.uesrID = val;
        this.getUserDetails(this.uesrID)
      }
    });
   }

  ngOnInit() {}

  email: any;
  password: any;
  profilePicture: any = "https://www.gravatar.com/avatar/"

  userInfo = {
    name: '',
    dob: '',
    mobile: '',
    img: ''
  };
  getUserDetails(Id) {

    let formData = new FormData();
    formData.append('app_user_id', Id);

    this.globalService.postData('profile', formData).subscribe(res => {
      if (res['status']) {
        this.userDetails = res['app_user_details'][0];
        this.userInfo.name = this.userDetails['app_user_name'];
        this.userInfo.mobile = this.userDetails['app_user_mobile'];
        this.userInfo.dob = this.userDetails['app_user_dob'];
        this.userInfo.img = res['app_user_image'];
       }
    });
  }


  logout(){
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}


