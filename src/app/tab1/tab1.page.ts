import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CommentsComponent } from "../comments/comments.component";

import { HomeComponent } from "../home/home.component";
import { UserInfoService } from "../user-info.service";
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  userID: any;
  postList: any;
  path: any = '';
  name: any = 'Guest';
  sliderTwo: { isBeginningSlide: boolean; isEndSlide: boolean; slidesItems: { id: number; image: string; }[]; };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };
  constructor(private modalCtrl: ModalController, private storage: Storage, private router : Router, private globalService: GlobalService, private alertCtrl: AlertController,private UserInfoService : UserInfoService) {
    this.userID = this.UserInfoService.getUserID();


    this.sliderTwo =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 6,
          image: '../../assets/logo.jpg'
        },
        {
          id: 7,
          image: '../../assets/logo.jpg'
        },
        {
          id: 8,
          image: '../../assets/logo.jpg'
        },
        {
          id: 9,
          image: '../../assets/logo.jpg'
        },
        {
          id: 10,
          image: '../../assets/shapes.svg'
        }
      ]
    };

    this.storage.get('userName').then((val) => {
      if(val){
        this.name = val;
      }
    });
  }

  ionViewWillEnter(){
    //calling an API
    this.getPostList();
  }
  getPostList(){
    
    let formData = new FormData();
    formData.append('company_id', '1');
    this.globalService.postData('all_post_list',formData).subscribe(res => {
      if (res.status) {
        this.postList = res['post_list'];
        this.path = res['path'];
      }
    });
  }
  async moveToFirst(id) {
    console.log(id);
      const modal = await this.modalCtrl.create({
        component: CommentsComponent,
        componentProps: { ids: id}
    });

    return await modal.present();
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

  goToPost(val1){
    this.storage.get('userId').then((val) => {
      if (!val) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/post',val1]);
      }
    });
  }
}
