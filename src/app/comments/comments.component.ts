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

  // tslint:disable-next-line: max-line-length
  constructor(public navParams : NavParams, public loadingController: LoadingController, private nav: NavController, private storage: Storage, private modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, private globalService: GlobalService) { }

  postId; any;
  userId;
  @Input("ids") value;
  loginFlag = false;

  ngOnInit() {

    this.postId = this.navParams.get('ids');
    this.getComments(this.postId);

    this.storage.get('userId').then(async (val) => {
      if (!val) {
        this.loginFlag = true
      }else{
        this.userId = val;
      }
    });

  }

  getComments(id){

    let formData = new FormData();
    formData.append('post_id',id);

    this.globalService.postData('comment_list', formData).subscribe(res=>{
      if (res['status']){
        this.comments = res['comment_list'];
        this.path = res['image_path'];
      }
    });

  }
  comment: any;

  async postComment(){

    if(this.comment === '' || this.comment === undefined || this.comment === null){
      return;
    }

    let formData = new FormData();
    formData.append('post_id', this.postId);
    formData.append('post_comment_desc', this.comment);
    formData.append('company_id', '1');
    formData.append('app_user_id', this.userId);

    const loading = await this.loadingController.create({
      message: 'Please wait',
    });

    await loading.present();

    this.globalService.postData('add_comment', formData).subscribe(res=>{
      if (res['status']){
        loading.dismiss();
        this.comment = '';
        this.comments = res['comment_list'];
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
