import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../service/global.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

import { ActionSheetController, LoadingController, Platform, NavParams, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  
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
  editValue: any;

  constructor(private http: HttpClient, private file: File, public loadingController: LoadingController, private platform: Platform, private route: ActivatedRoute,
    private storage: Storage, private router: Router, private globalService: GlobalService,
    private camera: Camera, public actionSheetController: ActionSheetController, public navParams: NavParams, private modalCtrl: ModalController) {
   
    this.postType = this.navParams.get('value');
    this.editValue = this.navParams.get('ids');
  }

  ngOnInit() {
    if(this.postType === 'POST'){
    this.post.title = this.editValue['post_title'];
    this.post.desc = this.editValue['post_desc'];
    }else {
      this.post.title = this.editValue['question_title'];
      this.post.desc = this.editValue['question_desc'];
    }

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

  async submit() {

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

      
      formData.append('post_id', this.editValue.post_id);
      formData.append('post_title', this.post.title);
      formData.append('post_desc', this.post.desc);

      if (this.post.link) {
        var video_id = this.post.link.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }

        formData.append('post_video_link', video_id);
      } else {
        if (this.editValue.post_video_link !== '' && this.editValue.post_video_link !== null){
          formData.append('post_video_link', this.editValue.post_video_link);
        }else{
          formData.append('post_video_link', '');
        }
      }

      // formData.append('post_file', this.base64);
      if (!this.post.link && this.filename) {
        formData.append('post_file', this.imageblob, this.filename);
        formData.append('old_post_img', '');
      } else {

        formData.append('old_post_img', this.editValue.post_file);
        formData.append('post_file', '');
        // if (this.editValue.post_file !== '' && this.editValue.post_file !== null) {
        //   formData.append('post_file', this.editValue.post_file);
        // } else {
        //   formData.append('post_file', '');
        // }
        
      }

    }
    else {
      formData.append('question_title', this.post.title);
      formData.append('question_desc', this.post.desc);
      formData.append('question_id', this.editValue.question_id);

      if (this.post.link) {
        var video_id = this.post.link.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }

        formData.append('question_video_link', video_id);
      } else {
    
        if (this.editValue.question_video_link !== '' && this.editValue.question_video_link !== null) {
          formData.append('question_video_link', this.editValue.question_video_link);
          
        } else {
          formData.append('question_video_link', '');
          
        }
      }


      if (this.filename) {
        formData.append('question_file', this.imageblob, this.filename);
        formData.append('old_question_img', '');
      } else {

        formData.append('old_question_img', this.editValue.question_file);
        formData.append('question_file', '');
        // if (this.editValue.question_file !== '' && this.editValue.question_file !== null) {
        //   formData.append('question_file', '');
         
        // } else {
        //   formData.append('question_file', '');
         
        // }
      }
      //formData.append('question_video_link', '');
      //formData.append('question_file', this.base64.name);
    }

    let url = 'update_question';

    if (this.postType === 'POST') {
      url = 'update_post';
    }

    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
    
    this.http.post("http://lawprotectorsipr.in/poltry/Poltry_API/" + url, formData)
      .subscribe(async res => {
        this.loadingController.dismiss();
        if (res['status']) {

          const loading = await this.loadingController.create({
            spinner: null,
            message: 'Data Updated Successfully',
            duration: 1000
          });
          await loading.present();
          this.closeModal();
        } else {
          this.error = 'Error while saving data';
        }
      });

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
