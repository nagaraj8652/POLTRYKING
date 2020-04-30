import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../app/login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from '../app/register/register.component';
import { OtpComponent } from "../app/otp/otp.component";
import { AddPostComponent } from "../app/add-post/add-post.component";
import { HomeComponent } from "../app/home/home.component";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentsComponent } from "../app/comments/comments.component";
import { ReactiveFormsModule } from '@angular/forms';
import { UserInfoService } from "../app/user-info.service";
import { ViewerModelComponent } from "../app/viewer-model/viewer-model.component";

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/Camera/ngx';

import { DatePipe } from '@angular/common';


import { ProfileComponent } from "../app/profile/profile.component";
import { ForgetPassComponent } from "../app/forget-pass/forget-pass.component";

import { SafeHtmlPipe } from "../app/pipe/SafeHtmlPipe";
import { MypostComponent } from "../app/mypost/mypost.component";

import { ResetPassComponent } from "../app/reset-pass/reset-pass.component";
import { BusinessCardComponent } from "../app/business-card/business-card.component";

import { File } from '@ionic-native/file/ngx';
// import { FilePath } from '@ionic-native/file-path/ngx';
// import { VideoPlayer } from '@ionic-native/video-player/ngx';
// import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { LikeviewComponent } from "../app/likeview/likeview.component";
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
// import { OrderByPipe } from './order-by.pipe';
import { OrderModule} from 'ngx-order-pipe';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Badge } from '@ionic-native/badge/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id';
// import { Uid } from '@ionic-native/uid';
import { Device } from '@ionic-native/device/ngx';
import { EditComponent } from "../app/edit/edit.component";


@NgModule({
  declarations: [
    AppComponent,
    MypostComponent,
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    ProfileComponent,
    ForgetPassComponent,
    EditComponent,
    AddPostComponent,
    HomeComponent,
    ResetPassComponent,
    CommentsComponent,
    ViewerModelComponent,
    LikeviewComponent,
    BusinessCardComponent,
    // Uid,
    // OrderByPipe/
  ],
  entryComponents: [],
  imports: [NgxIonicImageViewerModule, OrderModule,  BrowserModule,IonicStorageModule.forRoot(), MatButtonModule, ReactiveFormsModule, MatTabsModule, MatIconModule,MatSliderModule, FormsModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [
    StatusBar,
    Camera,
     File,
    OneSignal,
     SocialSharing,
    Badge,
    Device,
    // FilePath,
    // VideoPlayer,
    YoutubeVideoPlayer,
    DatePipe,

    SplashScreen,
    UserInfoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
