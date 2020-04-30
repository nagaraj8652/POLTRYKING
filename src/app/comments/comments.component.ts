import { Component, OnInit ,Input } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { NavParams} from '@ionic/angular';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  comments: any;
  path: any;
  value1: any;

  // tslint:disable-next-line: max-line-length
  constructor(public navParams : NavParams, public loadingController: LoadingController, private nav: NavController, private storage: Storage, private modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, private globalService: GlobalService) { }

  postId; any;
  userId;

  @Input("ids") value;
  @Input("value") value2;
  loginFlag = false;

  ngOnInit() {

    this.postId = this.navParams.get('ids');
    this.value1 = this.navParams.get('value');
    
    console.log(this.navParams);

    this.getComments(this.postId);

    this.storage.get('userId').then(async (val) => {
      if (!val) {
        this.loginFlag = true
      }else{
        this.userId = val;
      }
    });

  }

  async getComments(id){

    let formData = new FormData();
    let url='';
    if (this.value1 === 'Comments') {
      formData.append('post_id',id);
      url = 'comment_list';
    }else{
      formData.append('question_id', id);
      url = 'answer_list';
    }

    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    this.globalService.postData(url, formData).subscribe(res=>{
      this.loadingController.dismiss();
      
      if (res['status']){
        if (this.value1 === 'Comments') {
          this.comments = res['comment_list'];
        } else {
          this.comments = res['answer_list'];
        }
        this.path = 'http://lawprotectorsipr.in/poltry/assets/images/app_user/';
      }
    });

  }
  comment: any;

  async postComment(){

    if(this.comment === '' || this.comment === undefined || this.comment === null){
      return;
    }

    let formData = new FormData();
    let url = '';
    if (this.value1 === 'Comments'){
     
      formData.append('post_id', this.postId);
      formData.append('post_comment_desc', this.comment);
      formData.append('company_id', '1');
      formData.append('app_user_id', this.userId);
      url = 'add_comment';
    } else{

      formData.append('question_id', this.postId);
      formData.append('answer_desc', this.comment);
      formData.append('company_id', '1');
      formData.append('app_user_id', this.userId);
      url = 'add_answer';
    }
    const loading = await this.loadingController.create({
      message: 'Please wait',
    });

    await loading.present();

    this.globalService.postData(url, formData).subscribe(res=>{
      if (res['status']){
        loading.dismiss();
        this.comment = '';

        if (this.value1 === 'Comments'){
          this.comments = res['comment_list'];
        }else {
          this.comments = res['answer_list'];
        }
        this.getComments(this.postId);
      }else{
        loading.dismiss();
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
