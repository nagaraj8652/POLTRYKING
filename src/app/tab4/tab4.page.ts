import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../service/global.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  postType: string;
  post = {
    title : '',
    desc : '',
  };

  userID;
  error: string;
  constructor(public loadingController: LoadingController,private route: ActivatedRoute, private storage: Storage, private router : Router,private globalService: GlobalService,private camera : Camera,public actionSheetController: ActionSheetController) { 
    this.storage.get('userId').then(async (val) => {
      if (!val) {
        const loading = await this.loadingController.create({
          spinner: null,
          message: 'Please Login to POST',
          duration: 2000
        });

        await loading.present();

        this.router.navigate(['/login']);
      } 
    });
  }

  ngOnInit() {
    this.post.title = '';
    this.post.desc = '';
    this.storage.get('userId').then((val) => {
      this.userID = val;
    });
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  submit(){

    this.storage.get('userId').then((val) => {
      if(!val){
        this.router.navigate(['/login']);
      }
    });
    
    if(this.post.title === '' || this.post.title == undefined){
      this.error = 'Please enter title';
      return;
    }

    if(this.post.desc === '' || this.post.desc == undefined){
      this.error = 'Please enter Description';
      return;
    }

    this.error = '';
    
    let formData = new FormData();
    formData.append('app_user_id', '1');
    formData.append('company_id', '1');
    formData.append('post_title', this.post.title);
    formData.append('post_desc', this.post.desc);
    formData.append('post_video_link', '1');
    formData.append('post_file', '1');
    
    let url = 'add_post';
   

    this.globalService.postData(url, formData).subscribe(res=>{
      if (res['status']){

      }

    })

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

