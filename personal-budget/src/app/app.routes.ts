import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Homepage} from './homepage/homepage';
import { About } from './about/about';
import { Login } from './login/login';
import { P404 } from './p404/p404';

export const routes: Routes = [
  {
    path: '',
    component: Homepage
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'login',
    component: Login
  },
    {
    path: '**',
    component: P404
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

