import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { ProfilepictureComponent } from './components/profilepicture/profilepicture.component';

export const routes: Routes = [
    {path:'signup',component:SignupComponent,title:'sign up'},
    {path:'profilepic',component:ProfilepictureComponent,title:'profile photo'}
];
