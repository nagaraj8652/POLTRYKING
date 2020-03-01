import { Component } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  postList: any;
  path: any;

  constructor(private storage: Storage, private router : Router,private globalService: GlobalService) {

    this.getPostList();
  }

  getPostList(){
    
    let formData = new FormData();
    formData.append('company_id', '1');

    // const loading = await this.loadingController.create({
    //   message: 'Please wait...',
    //   duration: 2000
    // });
    // await loading.present();
    this.globalService.postData('govt_scheme_list',formData).subscribe(res => {
      // loading.onDidDismiss();
      if (res.status) {
        this.postList = res['govt_scheme_list'];
        this.path = res['path'];
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
}
