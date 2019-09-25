import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UploadDummyComponent } from './upload-dummy/upload-dummy.component';
import { UploadBusinessComponent } from './upload-business/upload-business.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
  {
    path: 'uploadUsersDummy',
    component: UploadDummyComponent
  },
  {
    path: 'uploadBusinessDummy',
    component: UploadBusinessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
