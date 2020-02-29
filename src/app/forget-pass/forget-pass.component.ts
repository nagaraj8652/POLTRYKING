import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
})
export class ForgetPassComponent implements OnInit {

  constructor(public loadingController: LoadingController,private globalService: GlobalService,private router : Router) {

  }

  ngOnInit() {}

  forgetMobile;
  errorMsg1;

  sendOtp(){
    let formData = new FormData();
    formData.append('mobile_no', this.forgetMobile);
    this.globalService.postData('forgot_password', formData).subscribe(res=>{
      if (res['status']){
        this.router.navigate(['/otp', '1',res['app_user_id'], this.forgetMobile]);
      } else {
          this.errorMsg1 = res.msg;
      }
    });
  }

}
