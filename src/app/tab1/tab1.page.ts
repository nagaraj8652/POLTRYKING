import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CommentsComponent } from "../comments/comments.component";

import { HomeComponent } from "../home/home.component";
import { UserInfoService } from "../user-info.service";
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import {DomSanitizer} from '@angular/platform-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
 

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
  postListAdv: any;
  pathAdv: any;
  constructor( private youtube: YoutubeVideoPlayer,public sanitizer:DomSanitizer,private videoPlayer: VideoPlayer,private modalCtrl: ModalController, private storage: Storage, private router : Router, private globalService: GlobalService, private alertCtrl: AlertController,private UserInfoService : UserInfoService) {
    this.userID = this.UserInfoService.getUserID();

    this.getAdv();
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

  getAdv(){
    let formData = new FormData();
    formData.append('company_id', '1');
    this.postListAdv = [];
    this.globalService.postData('advertisement_list',formData).subscribe(res => {
      if (res.status) {
          if(res['advertisement_list']){
              let i = 0;
              res['advertisement_list'].forEach(adv => {
                  this.postListAdv.push({id : i , image : res['path']+adv.advertisement_logo});
                  i++;
              });
          }

      }
    });

    console.log(this.postListAdv);

    this.sliderTwo =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.postListAdv
    };

    console.log(this.sliderTwo);
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

  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

    //Move to Next slide
    slideNext(object, slideView) {
      slideView.slideNext(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });
    }
   
    //Move to previous slide
    slidePrev(object, slideView) {
      slideView.slidePrev(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });;
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

  playVideoHosted() {
    this.videoPlayer.play('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4').then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }
}
