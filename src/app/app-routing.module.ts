import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { OtpComponent } from "../app/otp/otp.component";
import { AddPostComponent } from "../app/add-post/add-post.component";
import { HomeComponent } from "../app/home/home.component";
import { CommentsComponent } from "../app/comments/comments.component";
import { ProfileComponent } from "../app/profile/profile.component";
import { ForgetPassComponent } from "../app/forget-pass/forget-pass.component";
import { ResetPassComponent } from "../app/reset-pass/reset-pass.component";
import { BusinessCardComponent } from "../app/business-card/business-card.component";
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'register/:id', component: RegisterComponent },
  { path: 'otp/:id/:userId/:mobile', component: OtpComponent},
  { path: 'post/:value', component: AddPostComponent},
  { path: 'forget', component : ForgetPassComponent},
  { path: 'home1', component: HomeComponent},
  { path: 'comments', component: CommentsComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'reset/:id', component: ResetPassComponent},
  { path: 'bussiness', component: BusinessCardComponent},
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
