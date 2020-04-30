import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../service/global.service';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CommentsComponent } from "../comments/comments.component";
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  postList: any;
  path: any;

  constructor(private storage: Storage, private router: Router, private youtube: YoutubeVideoPlayer,private modalCtrl: ModalController, public loadingController: LoadingController , private globalService: GlobalService) { }

  ngOnInit() {
    this.getPostList();
  }


  doRefresh(event) {

    event.target.complete();

    this.getPostList();
  }

  getPostList(){
    
    let formData = new FormData();
    formData.append('company_id', '1');
    this.globalService.postData('all_question_list',formData).subscribe(res => {
      if (res.status) {
        this.postList = res['question_list'];
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

likePost(postListId){
    this.storage.get('userId').then(async (val) => {
      if(!val){
        const loading = await this.loadingController.create({
          spinner: null,
          message: 'Please login to Like',
          duration: 1000
        });
    
        await loading.present();
        return;
      }
      else{

        let formData = new FormData();
        formData.append('company_id', '1');
        formData.append('question_id', postListId);
        formData.append('app_user_id', val);

        const loading = await this.loadingController.create({
          message: 'Loading...'
        });
        await loading.present();

        this.globalService.postData('add_question_like', formData).subscribe(async res => {
          
          this.loadingController.dismiss();

          if (res.status) {
            const loading = await this.loadingController.create({
              spinner: null,
              message: 'you liked post successfully',
              duration: 1000
            });
        
            await loading.present();

            this.getPostList();
          }
        });

      }
    });
  }

  async moveToFirst(id) {
    console.log(id);
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      componentProps: { ids: id ,value:'Answers'}
    });

    return await modal.present();
  }

  openvideo(val) {
    this.youtube.openVideo(val);
  }
}
