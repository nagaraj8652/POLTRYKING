import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  userID: any;
  postList: any;
  path: any;
  businessList: any;

  constructor( private globalService: GlobalService,private storage: Storage, private router : Router) {
    this.getPostList();
  }

  getPostList(){

    let formData = new FormData();
    formData.append('company_id', '1');
    this.globalService.postData('business_list',formData).subscribe(res => {
      if (res.status) {
        this.businessList = res['business_list'];
        this.path = res['path']
      }
    });
  }

  goToProfile(){
    this.storage.get('userId').then((val) => {
      if(!val){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/profile']);
      }
    });
  }

  getBusiness(item){
 //   let item1 = JSON.
  let navigationExtras: NavigationExtras = {
    state: {
      data: item
    }
  };
    this.router.navigate(['bussiness'], navigationExtras);

  }
}
