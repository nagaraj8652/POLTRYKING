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
    storage.set('name', 'Max');
  }

  ngOnInit() {
    this.storage.get('name').then((val) => {
      console.log('Your age is', val);
    });
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

    console.log(this.myForm);
    if (this.myForm.value['phone'].length == 10){
      this.errorMsg = "Please Enter valid Mobile No";
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
      duration: 2000
    });

    await loading.present();
    this.globalService.postData('sign_in', formData).subscribe(res=>{
      loading.onDidDismiss();
      if (res['status']){

        this.UserInfoService.setUserID(res.app_user_id);
        this.router.navigate(['/apps/home/tab1']);
        this.errorMsg = "";
      }

    })
  }
  forgotPass(){
    this.forgetFlag = true;
  }
}
