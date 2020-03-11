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

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/Camera/ngx';

import { DatePipe } from '@angular/common';


import { ProfileComponent } from "../app/profile/profile.component";
import { ForgetPassComponent } from "../app/forget-pass/forget-pass.component";

import { SafeHtmlPipe } from "../app/pipe/SafeHtmlPipe";
import { HtmlPipe } from './html.pipe';

import { ResetPassComponent } from "../app/reset-pass/reset-pass.component";
import { BusinessCardComponent } from "../app/business-card/business-card.component";

import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    ProfileComponent,
    ForgetPassComponent,
    AddPostComponent,
    HomeComponent,
    ResetPassComponent,
    CommentsComponent,
    BusinessCardComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicStorageModule.forRoot(), MatButtonModule, ReactiveFormsModule, MatTabsModule, MatIconModule,MatSliderModule, FormsModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [
    StatusBar,
    Camera,
    File,
    FilePath,
    DatePipe,
    SplashScreen,
    UserInfoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
