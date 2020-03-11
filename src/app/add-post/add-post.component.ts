import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../service/global.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
// private filePath: FilePath, private file: File,
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
  constructor(public loadingController: LoadingController, private filePath: FilePath,
    private file: File, private platform: Platform,  private route: ActivatedRoute,
    private storage: Storage, private router : Router,private globalService: GlobalService,
    private camera : Camera,public actionSheetController: ActionSheetController) { 
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
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
    
      this.base64 = imageData;

       let base64Image = 'data:image/jpeg;base64,' + imageData;

      console.log(imageData);
    }, (err) => {
      // Handle error
    });
  }


  takePicture(sourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      console.log(newFileName);
      //this.updateStoredImages(newFileName);
    }, error => {
      //this.presentToast('Error while storing file.');
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
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
    formData.append('post_file', this.base64);

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

        this.post.title = '';
        this.post.desc = '';
      } else {
        this.error = 'Error while saving data';
      }

    });

  }
}
