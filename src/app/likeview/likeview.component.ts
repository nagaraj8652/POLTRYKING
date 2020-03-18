import { Component, OnInit ,Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { NavParams} from '@ionic/angular';

@Component({
  selector: 'app-likeview',
  templateUrl: './likeview.component.html',
  styleUrls: ['./likeview.component.scss'],
})
export class LikeviewComponent implements OnInit {
  Likes: any;

  constructor(public navParams : NavParams,private nav: NavController,private storage: Storage, private modalCtrl: ModalController,private route: ActivatedRoute, private router: Router,private globalService: GlobalService) { }

  postId; any;
  userId;
  @Input("ids") value;

  ngOnInit() {
    this.postId = this.navParams.get('ids');
    this.getLikes(this.postId);

    this.storage.get('userId').then(async (val) => {
      if (!val) {
 
      }else{
        this.userId = val;
      }
    });
  }

  getLikes(id: any) {

    let formData = new FormData();
    formData.append('post_id',id);

    this.globalService.postData('like_list', formData).subscribe(res=>{
      if (res['status']){
        this.Likes = res['like_list'];
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
