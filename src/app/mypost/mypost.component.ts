import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { ActionSheetController, AlertController, LoadingController, Platform, ModalController } from '@ionic/angular';
import { EditComponent } from "../edit/edit.component";

@Component({
  selector: 'app-mypost',
  templateUrl: './mypost.component.html',
  styleUrls: ['./mypost.component.scss'],
})
export class MypostComponent implements OnInit {
  type: string;
  userID: string;
  postList: any;
  path: any;

  constructor(private route: ActivatedRoute, private modalCtrl: ModalController, public loadingController: LoadingController, private storage: Storage,private router: Router, private globalService: GlobalService) {

    this.type = this.route.snapshot.paramMap.get('type');
    this.userID = this.route.snapshot.paramMap.get('id');
   }

  ngOnInit() {}


  ionViewWillEnter() {
    if (this.type === 'Post'){
      this.getPostList();
    }else{
      this.questionList();
    }
  }

  questionList(){
    let formData = new FormData(); 
    formData.append('company_id', '1');
    formData.append('app_user_id', this.userID);
    this.globalService.postData('question_list_by_user', formData).subscribe(async res => {
      if (res.status) {
        this.postList = res['question_list'];
        this.path = 'http://lawprotectorsipr.in/poltry/assets/images/question/';
      }else{
        this.postList = [];
        const loading = await this.loadingController.create({
          spinner: null,
          message: res['msg'],
          duration: 1000
        });
        await loading.present();
      }
    });
  }

  doRefresh(event) {

    if (this.type === 'Post') {
      this.getPostList();
    } else {
      this.questionList();
    }
    event.target.complete();
  }

  getPostList() {

    let formData = new FormData();
    
    formData.append('company_id', '1');
    formData.append('app_user_id', this.userID);
    this.globalService.postData('post_list_by_user', formData).subscribe(async res => {
      if (res.status) {
        this.postList = res['post_list'];
        this.path = 'http://lawprotectorsipr.in/poltry/assets/images/post/';
      }else{
        this.postList = [];
        const loading = await this.loadingController.create({
          spinner: null,
          message: res['msg'],
          duration: 1000
        });
        await loading.present();
      }
    });
  }

  goToProfile() {
    this.storage.get('userId').then((val) => {
      if (!val) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/profile']);
      }
    });
  }

  deletePost(item){
    let formData = new FormData();
    formData.append('post_id', item.post_id);
    if (item.post_file === '' || item.post_file === null){
      formData.append('old_post_img', '');
    }else{
      formData.append('old_post_img', item.post_file);
    }
    this.globalService.postData('delete_post', formData).subscribe(async res => {
      if (res.status) {
        const loading = await this.loadingController.create({
          spinner: null,
          message: 'Post Deleted Successfully',
          duration: 1000
        });
        await loading.present();
        this.getPostList();
      }
    });
  }
  deleteQuestion(item) {
    let formData = new FormData();
    formData.append('question_id', item.question_id);
    if (item.question_file === '' || item.question_file === null) {
      formData.append('old_question_img', '');
    } else {
      formData.append('old_question_img', item.question_file);
    }
    

    this.globalService.postData('delete_question', formData).subscribe(async res => {
      if (res.status) {
        const loading = await this.loadingController.create({
          spinner: null,
          message: 'Question Deleted Successfully',
          duration: 1000
        });
        await loading.present();
        this.questionList();
      }
    });
  }

  async Edit(item,type) {
  
    const modal = await this.modalCtrl.create({
      component: EditComponent,
      componentProps: { ids: item, value: type }
    });

    return await modal.present();
  }
}
