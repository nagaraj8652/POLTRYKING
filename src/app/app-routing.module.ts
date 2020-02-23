import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { OtpComponent } from "../app/otp/otp.component";
import { AddPostComponent } from "../app/add-post/add-post.component";
import { HomeComponent } from "../app/home/home.component";
import { CommentsComponent } from "../app/comments/comments.component";

const routes: Routes = [
  {
    path: 'apps',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'otp', component: OtpComponent},
  { path: 'post', component: AddPostComponent},
  { path: 'home1', component: HomeComponent},
  { path: 'comments', component: CommentsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
