import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';

import { PostListComponent } from './post-list/post-list.component';
import { MyPostComponent } from './post-my/my-post.component';
import { FavoritePostComponent } from './post-favorite/favorite-post.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostAddComponent } from './post-add/post-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    HttpClientModule,
    FileUploadModule,
    MultiselectDropdownModule,
    SharedPipesModule
  ],
  declarations: [PostListComponent, MyPostComponent, FavoritePostComponent, PostEditComponent, PostAddComponent]
})
export class PostModule { }
