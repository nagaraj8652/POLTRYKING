import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  countyList : [];
  stateList : [];
  districtList : [];

  myForm: FormGroup;
  password1: any = "";
  password2: any = "";

  constructor(private globalService: GlobalService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      //pass: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],     
      country: ['', Validators.required],
      state: ['', Validators.required],
      dist: ['', Validators.required],
      about: ['', Validators.required],
      terms: ['', Validators.required]
    });

    this.globalService.getRequest('country_list').subscribe(res=>{
      if(res.status){
        this.countyList = res['country_list'];
      }
    });

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
  countryChange(event){

    let formData = new FormData();
    formData.append('country_id', this.country);
    this.globalService.postData('state_list',formData).subscribe(res => {
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
    }

   
  }
}
