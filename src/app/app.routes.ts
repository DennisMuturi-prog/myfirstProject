import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { ProfilepictureComponent } from './components/profilepicture/profilepicture.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';

export const routes: Routes = [
    {path:'signup',component:SignupComponent,title:'sign up'},
    {path:'signin',component:SigninComponent,title:'sign in'},
    {path:'profilepic',component:ProfilepictureComponent,title:'profile photo'},
    {path:'home',component:HomeComponent,title:'home'},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
