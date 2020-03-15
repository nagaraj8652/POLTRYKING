import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../service/global.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {

  postType: string;
  post = {
    title: '',
    desc: '',
    link: '',
  };
  videolink = false;
  userID;
  error: string;
  uploadedFiles: any;
  image: any;
  constructor(private http: HttpClient, private file: File, public loadingController: LoadingController, private platform: Platform, private route: ActivatedRoute,
    private storage: Storage, private router: Router, private globalService: GlobalService,
    private camera: Camera, public actionSheetController: ActionSheetController) {
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
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {

      this.base64 = imageData;

      this.startUpload(imageData);
      // this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
      //   entry.file(file => {
      //     console.log(file);
      //     this.base64 = file;
      //   });
      // });
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // this.base64 = imageData;

      //  let base64Image = 'data:image/jpeg;base64,' + imageData;

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


  startUpload(imgEntry) {
    console.log(imgEntry);
    this.file.resolveLocalFilesystemUrl(imgEntry)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        console.log('Error while reading file.');
      });
  }

  imageblob;
  filename;

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });

      this.imageblob = imgBlob;
      this.filename = file.name;

      // formData.append('app_user_id', this.userID);
      // formData.append('company_id', '1');


      // formData.append('post_title', this.post.title);
      // formData.append('post_desc', this.post.desc);
      // formData.append('post_video_link', this.post.link);
      // this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }


  async uploadImageData(formData: FormData) {

    this.http.post("http://lawprotectorsipr.in/poltry/Poltry_API/add_post", formData)

      .subscribe(res => {
        if (res['status']) {
          console.log('File upload complete.')
        } else {
          console.log('File upload failed.')
        }
      });
  }

  submit() {

    this.storage.get('userId').then((val) => {
      if (!val) {
        this.router.navigate(['/login']);
      }
    });

    if (this.post.title === '' || this.post.title == undefined) {
      this.error = 'Please enter title';
      return;
    }

    if (this.post.desc === '' || this.post.desc == undefined) {
      this.error = 'Please enter Description';
      return;
    }

    this.error = '';


  
    let formData = new FormData();
    formData.append('app_user_id', this.userID);
    formData.append('company_id', '1');

    if (this.postType === 'POST') {

      formData.append('post_title', this.post.title);
      formData.append('post_desc', this.post.desc);

      if(this.post.link){
        var video_id = this.post.link.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }

        formData.append('post_video_link', video_id);
      }else{
        formData.append('post_video_link','');
      } 
      
      // formData.append('post_file', this.base64);
      if (!this.post.link && this.filename) {
        formData.append('post_file', this.imageblob, this.filename);
      } else {
        formData.append('post_file', '');
      }

    }
    else {
      formData.append('question_title', this.post.title);
      formData.append('question_desc', this.post.desc);

      if (this.filename) {
        formData.append('question_file', this.imageblob, this.filename);
      } else {
        formData.append('question_file', '');
      }
      //formData.append('question_video_link', '');
      //formData.append('question_file', this.base64.name);
    }

    let url = 'add_question';

    if (this.postType === 'POST') {
      url = 'add_post';
    }


    this.http.post("http://lawprotectorsipr.in/poltry/Poltry_API/" + url, formData)
      .subscribe(async res => {
        if (res['status']) {

          const loading = await this.loadingController.create({
            spinner: null,
            message: 'Data Saved Successfully',
            duration: 1000
          });
          await loading.present();

          this.post.title = '';
          this.post.desc = '';
          this.post.link = '';
          this.videolink = false;
          this.base64 = '';
          this.imageblob = '';
          this.filename = '';
        } else {
          this.error = 'Error while saving data';
        }
      });

    // this.globalService.postupload(url, formData).subscribe(async res => {
    //   if (res['status']) {

    //     const loading = await this.loadingController.create({
    //       spinner: null,
    //       message: 'Data Saved Successfully',
    //       duration: 1000
    //     });
    //     await loading.present();

    //     this.post.title = '';
    //     this.post.desc = '';
    //     this.post.link = '';
    //     this.videolink = false;
    //     this.base64 = '';
    //   } else {
    //     this.error = 'Error while saving data';
    //   }

    // });

  }
}
