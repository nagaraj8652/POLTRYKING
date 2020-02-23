import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CommentsComponent } from "../comments/comments.component";

import { HomeComponent } from "../home/home.component";
import { UserInfoService } from "../user-info.service";
import { GlobalService } from '../service/global.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  userID: any;
  postList: any;


  constructor(private modalCtrl: ModalController, private globalService: GlobalService, private alertCtrl: AlertController,private UserInfoService : UserInfoService) {
    this.userID = this.UserInfoService.getUserID();
    this.getPostList();
  }

  getPostList(){
    
    let formData = new FormData();
    formData.append('company_id', '1');
    this.globalService.postData('all_post_list',formData).subscribe(res => {
      if (res.status) {
        this.postList = res['post_list'];
      }
    });
  }
  async moveToFirst() {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent
    });

    return await modal.present();
  }
}
