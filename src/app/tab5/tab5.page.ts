import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  postList: any;
  path: any;

  constructor(private storage: Storage, private router : Router,private globalService: GlobalService) { }

  ngOnInit() {
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
}
