import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { NgForm, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserInfoService } from "../user-info.service";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  forgetFlag: boolean = false;


  errorMsg : string;

  myForm: FormGroup;

  constructor(public UserInfoService: UserInfoService, private storage: Storage, public loadingController: LoadingController,private globalService: GlobalService, private formBuilder: FormBuilder,private router : Router) {

  }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      pass: ['', Validators.required]
    });
  }

  async onSubmit(){

    if (!this.myForm.valid){
      this.errorMsg = "Please Enter the Details";
      return;
    }


    const data ={
      mobile_no: this.myForm.value['phone'],
      password: this.myForm.value['pass']
    };

    let formData = new FormData();
    formData.append('mobile_no', this.myForm.value['phone']);
    formData.append('password', this.myForm.value['pass']);

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    await loading.present();
    
    this.globalService.postData('sign_in', formData).subscribe(async res=>{
      loading.onDidDismiss();

      if (res['status']){

        this.UserInfoService.setUserID(res.app_user_id);
        this.storage.set('userId', res.app_user_id);
        this.storage.set('userName', res.app_user_name);
        this.storage.set('cityId', res.app_user_details['app_user_id']);
        this.router.navigate(['/home/tab1']);
        this.errorMsg = "";
      }else{
        if (res['otp_status'] === false){
          const loading = await this.loadingController.create({
            spinner: null,
            message: 'Validate OTP for Login',
            duration: 2000
          });

          await loading.present();
        }else{
          this.errorMsg = res['msg'];
        }
      }

    });
  }



}
