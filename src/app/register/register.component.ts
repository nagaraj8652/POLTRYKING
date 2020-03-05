import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  countyList: [];
  stateList: [];
  districtList: [];

  mobile: any;
  myForm: FormGroup;
  password1: any = "";
  password2: any = "";
  userId;
  userDetails: any;
  userInfo = {
    name: '',
    dob: '',
    mobile: '',
    dist: '',
    about: ''
  };
  editProfile: boolean = false;

  constructor(public loadingController: LoadingController,private globalService: GlobalService, private route: ActivatedRoute, private storage: Storage, public datepipe: DatePipe, private formBuilder: FormBuilder, private router: Router) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.editProfile = true;
      this.getUserDetails(this.route.snapshot.paramMap.get('id'));
    }
  }

  phoneNumber = "^(\+\d{1,3}[- ]?)?\d{10}$";

  ngOnInit() {

    if (this.route.snapshot.paramMap.get('id')) {

      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        dob: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.minLength(10)]],
        country: ['', Validators.required],
        state: ['', Validators.required],
        dist: ['', Validators.required],
        about: [''],

      });
    } else {
      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        dob: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.minLength(10)]],
        //pass: ['', Validators.required],
        password1: ['', Validators.required],
        password2: ['', Validators.required],
        country: ['', Validators.required],
        state: ['', Validators.required],
        dist: ['', Validators.required],
        about: [''],
        terms: [false, Validators.requiredTrue]
      });
    }
    this.globalService.getRequest('country_list').subscribe(res => {
      if (res.status) {
        this.countyList = res['country_list'];
      }
    });

    // this.storage.get('userId').then((val) => {
    //     this.userId = val;
    //     this.getUserDetails(val);
    // });


  }

  validatePasswords(control: AbstractControl, name: string) {
    if (this.myForm === undefined || this.password1.value === '' || this.password2.value === '') {
      return null;
    } else if (this.password1.value === this.password2.value) {
      if (name === 'password1' && this.password2.hasError('passwordMismatch')) {
        this.password1.setErrors(null);
        this.password2.updateValueAndValidity();
      } else if (name === 'password2' && this.password1.hasError('passwordMismatch')) {
        this.password2.setErrors(null);
        this.password1.updateValueAndValidity();
      }
      return null;
    } else {
      return { 'passwordMismatch': { value: 'The provided passwords do not match' } };
    }
  }


  country;
  state;
  countryChange(event) {

    let formData = new FormData();
    formData.append('country_id', this.country);
    this.globalService.postData('state_list', formData).subscribe(res => {
      if (res.status) {
        this.stateList = res['state_list'];
      }
    });
  }

  stateChange() {

    let formData = new FormData();
    formData.append('state_id', this.state);
    this.globalService.postData('district_list', formData).subscribe(res => {
      if (res.status) {
        this.districtList = res['district_list'];
      }
    });
  }

  errorMsg;
  async onSubmit() {

    console.log(this.myForm);
    if (!this.myForm.valid) {
      this.errorMsg = "Please Enter the Details";
      return;
    } else {

      if (!this.editProfile) {
        if (this.myForm.value['password1'] !== this.myForm.value['password2']) {
          this.errorMsg = "Password you entered is not the same";
          return;
        } else {
          this.errorMsg = '';

          this.myForm.value['dob'] = new Date();
          let latest_date = this.datepipe.transform(this.myForm.value['dob'], 'dd-MM-yyyy');

          let formData = new FormData();
          formData.append('app_user_name', this.myForm.value['name']);
          formData.append('app_user_mobile', this.myForm.value['mobile']);
          formData.append('app_user_dob', latest_date);
          formData.append('country_id', this.myForm.value['country']);
          formData.append('state_id', this.myForm.value['state']);
          formData.append('city_id', this.myForm.value['dist']);

          formData.append('about_info', this.myForm.value['about']);
          formData.append('app_user_password', this.myForm.value['password1']);

          this.globalService.postData('register_app_user', formData).subscribe(async res => {
            if (res['status']) {
              const loading = await this.loadingController.create({
                spinner: null,
                message: 'Please Confirm your Mobile Number',
                duration: 2000
              });
              // this.storage.set('userId', res['app_user_id']);
              this.router.navigate(['/otp', '2', res['app_user_id'], this.myForm.value['mobile']]);
            } else {
              this.errorMsg = res['msg'];
            } 
          });
        }
      } else {
        this.errorMsg = '';

        this.myForm.value['dob'] = new Date();
        let latest_date = this.datepipe.transform(this.myForm.value['dob'], 'dd-MM-yyyy');

        let formData = new FormData();
        formData.append('app_user_name', this.myForm.value['name']);
        formData.append('app_user_id', this.route.snapshot.paramMap.get('userId'));
        formData.append('app_user_mobile', this.myForm.value['mobile']);
        formData.append('app_user_dob', latest_date);
        formData.append('country_id', this.myForm.value['country']);
        formData.append('state_id', this.myForm.value['state']);
        formData.append('city_id', this.myForm.value['dist']);
        formData.append('about_info', this.myForm.value['about']);

        this.globalService.postData('update_profile', formData).subscribe(async res => {
          if (res['status']) {
            // this.storage.set('userId', res['app_user_id']);
            const loading = await this.loadingController.create({
              spinner: null,
              message: 'Profile updated successfully',
              duration: 2000
            });
            this.router.navigate(['/profile']);
          } else {
            this.errorMsg = res['msg'];
          } 
        });
      }

    }
  }

  getUserDetails(Id) {

    let formData = new FormData();
    formData.append('app_user_id', Id);

    this.globalService.postData('profile', formData).subscribe(res => {
      if (res['status']) {
        this.userDetails = res['app_user_details'][0];
        this.userInfo.name = this.userDetails['app_user_name'];
        this.userInfo.mobile = this.userDetails['app_user_mobile'];
        this.userInfo.dob = this.userDetails['app_user_dob'];
        this.country = this.userDetails['country_id'];
        this.state = this.userDetails['state_id'];
        this.userInfo.dist = this.userInfo['city_id'];
        this.userInfo.about = this.userInfo['app_user_about'];
      }
    });
  }
}
