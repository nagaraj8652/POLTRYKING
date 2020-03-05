import { Component, OnInit ,Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
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

  constructor(public navParams : NavParams,private nav: NavController,private storage: Storage, private modalCtrl: ModalController,private route: ActivatedRoute, private router: Router,private globalService: GlobalService) { }

  postId; any;
  @Input("ids") value;
  loginFlag = false;
  ngOnInit() {

    this.postId = this.navParams.get('ids');
    this.getComments(this.postId);

    this.storage.get('userId').then(async (val) => {
      if (!val) {
        this.loginFlag = true
      }
    });
  }

  getComments(id){

    let formData = new FormData();
    formData.append('post_id',id);

    this.globalService.postData('comment_list', formData).subscribe(res=>{
      if (res['status']){
        this.comments = res['comment_list'];
      }
    });

  }
  comment: any;

  postComment(){

    if(this.comment === '' || this.comment === undefined || this.comment === null){
      return;
    }

    let userId;
    this.storage.get('userId').then((val) => {
      if(!val){
        this.router.navigate(['/login']);
        this.closeModal();
        return;
      }else{
        userId = val;
      }
    });

    if(!userId){
      return;
    }
    let formData = new FormData();
    formData.append('post_id', this.postId);
    formData.append('post_comment_desc', this.comment);
    formData.append('company_id', '1');
    formData.append('app_user_id', userId);

    this.globalService.postData('add_comment', formData).subscribe(res=>{
      if (res['status']){
        this.comments = res['comment_list'];
        this.getComments(this.postId);
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
