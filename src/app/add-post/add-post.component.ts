import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../service/global.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {

  postType: string;
  post = {
    title : '',
    desc : '',
  };

  userID;
  error: string;
  constructor(public loadingController: LoadingController,private route: ActivatedRoute, private storage: Storage, private router : Router,private globalService: GlobalService,private camera : Camera,public actionSheetController: ActionSheetController) { 
      this.postType = this.route.snapshot.paramMap.get('value');
  }

  ngOnInit() {
    this.post.title = '';
    this.post.desc = '';
    this.storage.get('userId').then((val) => {
      this.userID = val;
    });
  }

  base64;


  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
    
      this.base64 = imageData;
       //let base64Image = 'data:image/jpeg;base64,' + imageData;

      console.log(imageData);
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

  dataURItoBlob(dataURI) {
   const byteString = window.atob(dataURI);
   const arrayBuffer = new ArrayBuffer(byteString.length);
   const int8Array = new Uint8Array(arrayBuffer);
   for (let i = 0; i < byteString.length; i++) {
     int8Array[i] = byteString.charCodeAt(i);
   }
   const blob = new Blob([int8Array], { type: 'image/jpeg' });    
   return blob;
  }


  getBlob (b64Data) {
    let contentType = '';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
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


    let urlCreator = window.URL;
    let dataBlob = this.getBlob(this.base64);
    let imageUrl = urlCreator.createObjectURL(dataBlob);

    console.log(imageUrl);


    let formData = new FormData();
    formData.append('app_user_id',   this.userID );
    formData.append('company_id', '1');

    if(this.postType === 'POST'){
    formData.append('post_title', this.post.title);
    formData.append('post_desc', this.post.desc);
    formData.append('post_video_link', '');
    formData.append('post_file', imageUrl);
    }
    else{
      formData.append('question_title', this.post.title);
      formData.append('question_desc', this.post.desc);
      formData.append('question_video_link', '');
      formData.append('question_file', imageUrl);
    }
    
    // return;
    //   let base64 = this.base64;
    //   // Naming the image
    //   const date = new Date().valueOf();
    //   let text = '';
    //   const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //   for (let i = 0; i < 5; i++) {
    //     text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length));
    //   }
    //   // Replace extension according to your media type
    //   const imageName = date + '.' + text + '.jpeg';
    //   // call method that creates a blob from dataUri
    //   const imageBlob = this.dataURItoBlob(base64);
    //   //const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });


    let url = 'add_question';

    if(this.postType === 'POST'){
      url = 'add_post';
    }

    this.globalService.postData(url, formData).subscribe(async res=>{
      if (res['status']){

        const loading = await this.loadingController.create({
          spinner: null,
          message: 'Data Saved Successfully',
          duration: 2000
        });
      } else {
        this.error = 'Error while saving data';
      }

    });

  }
}
