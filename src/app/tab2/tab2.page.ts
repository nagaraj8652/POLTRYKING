import { Component } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
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
  cityId: any;

  constructor(public loadingController: LoadingController, private globalService: GlobalService,private storage: Storage, private router : Router) {
    
    this.storage.get('cityId').then((val) => {
      if (val) {
        this.cityId = val;
      }
      this.getPostList();
    });
  }

  doRefresh(event) {

    this.getPostList();
    event.target.complete();

  }

  async getPostList(){

    let formData = new FormData();
    formData.append('company_id', '1');
    formData.append('city_id', this.cityId);
 
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    this.globalService.postData('business_list',formData).subscribe(res => {
      this.loadingController.dismiss();
      if (res.status) {
        this.businessList = res['business_list'];
        this.path = res['path']
      }
    },(err) => { this.loadingController.dismiss(); });
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
      data: {...item , 'PATH': this.path}
    }
  };
    this.router.navigate(['bussiness'], navigationExtras);

  }
}
