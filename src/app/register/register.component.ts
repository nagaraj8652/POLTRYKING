import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  countyList : [];
  stateList : [];
  districtList : [];
  constructor(private globalService: GlobalService,) { }

  ngOnInit() {
    this.globalService.getRequest('country_list').subscribe(res=>{
      if(res.status){
        this.countyList = res['country_list'];
      }
    });

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
}
