import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialListComponent } from './social-list/social-list.component';
import { CompanyBusinessComponent } from './company-business/company-business.component';
import { PrivateBusinessComponent } from './private-business/private-business.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { MyPostComponent } from './post/post-my/my-post.component';
import { PostEditComponent } from './post/post-edit/post-edit.component';
import { PostAddComponent } from './post/post-add/post-add.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { AnotherComponent } from './business-post/business-post.component';
import { BusinessEventComponent } from './business-event/business-event.component';
import { BusinessRequestComponent } from './business-request/business-request.component';
import { OnePostComponent } from './one-post/one-post.component';

const routes: Routes = [
  {
    path: 'list',
    component: SocialListComponent
  },
  {
    path: 'business/:id',
    component: CompanyBusinessComponent
  },
  {
    path: 'private',
    component: PrivateBusinessComponent
  },
  {
    path: 'allpost',
    component: PostListComponent
  },
  {
    path: 'mypost',
    component: MyPostComponent
  },
  {
    path: 'addpost',
    component: PostAddComponent
  },
  {
    path: 'edit',
    component: PostEditComponent
  },
  {
    path: 'business',
    component: CompanyBusinessComponent
  },
  {
    path: 'addbusiness',
    component: AddBusinessComponent
  },
  {
    path: 'mainpage',
    component: AnotherComponent
  },
  {
    path: 'event/:id',
    component: BusinessEventComponent
  },
  {
    path: 'request/:id',
    component: BusinessRequestComponent
  },
  {
    path: 'onepost/:id',
    component: OnePostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialRoutingModule { }
