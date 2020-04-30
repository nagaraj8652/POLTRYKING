import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  uesrID : any;
  userDetails: any;
  base64: any;
  imageblob: Blob;
  filename: any;

  constructor(private camera: Camera, public actionSheetController: ActionSheetController, private file: File, private globalService: GlobalService, private storage: Storage, private router : Router) {
    this.storage.get('userId').then((val) => {
      if(!val){
        this.router.navigate(['/login']);
      }else{
        this.uesrID = val;
        this.getUserDetails(this.uesrID)
      }
    });
   }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getUserDetails(this.uesrID);
  }

  email: any;
  password: any;
  profilePicture: any = "https://www.gravatar.com/avatar/"

  userInfo = {
    name: '',
    dob: '',
    mobile: '',
    img: '',
    country_id :'',
    state_id:'',
    city:'',
    about_info:''
  };
  getUserDetails(Id) {

    let formData = new FormData();
    formData.append('app_user_id', Id);

    this.globalService.postData('profile', formData).subscribe(res => {
      if (res['status']) {
        this.userDetails = res['app_user_details'][0];
        this.userInfo.name = this.userDetails['app_user_name'];
        this.userInfo.mobile = this.userDetails['app_user_mobile'];
        this.userInfo.dob = this.userDetails['app_user_dob'];

        this.userInfo.state_id = this.userDetails['state_id'];
        this.userInfo.country_id = this.userDetails['country_id'];
        this.userInfo.city = this.userDetails['city_id'];

        this.userInfo.about_info = this.userDetails['about_info'];

        if(this.userDetails['app_user_img'] !== null)
          this.userInfo.img = res['app_user_image'];
        }else{
          this.userInfo.img = null;
        }
    });
  }

  editProfile(){
    this.router.navigate(['/register', this.uesrID]);
  }



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
 
      this.save();
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

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });

      this.imageblob = imgBlob;
      this.filename = file.name;

      this.save();
    };
    reader.readAsArrayBuffer(file);
  }

  save(){

    let formData = new FormData();
    formData.append('app_user_id', this.uesrID);
    formData.append('app_user_img', this.imageblob, this.filename);

    formData.append('app_user_name', this.userInfo.name);
  
    formData.append('app_user_mobile', this.userInfo.mobile);
    formData.append('app_user_dob', this.userInfo.dob);
    formData.append('country_id', this.userInfo.country_id);
    formData.append('state_id', this.userInfo.state_id);
    formData.append('city_id', this.userInfo.city);
    formData.append('about_info', this.userInfo.about_info);

    this.globalService.postData('update_profile', formData).subscribe(async res => {
      if (res['status']) {
        this.getUserDetails(this.uesrID);
      }
    });
  }

  logout(){
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  myPost(val){
    this.router.navigate(['/mypost',this.uesrID,val]);
  } 


}


