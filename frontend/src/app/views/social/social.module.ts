import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SocialRoutingModule } from './social-routing.module';
import { PostModule } from './post/post.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { NgxSpinnerModule } from 'ngx-spinner'; 
// import { AgmCoreModule } from '@agm/core';

import { SocialListComponent } from './social-list/social-list.component';
import { CompanyBusinessComponent } from './company-business/company-business.component';
import { PrivateBusinessComponent } from './private-business/private-business.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { AnotherComponent } from './business-post/business-post.component';
import { BusinessEventComponent } from './business-event/business-event.component';
import { BusinessRequestComponent } from './business-request/business-request.component';
import { OnePostComponent } from './one-post/one-post.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    CustomFormsModule,
    SharedModule,
    TagInputModule,
    NgbModule,
    NgxSpinnerModule,
    TextMaskModule,
    HttpClientModule,
    FileUploadModule,
    MultiselectDropdownModule,
    SharedPipesModule,
    SocialRoutingModule,
    PostModule,
    InfiniteScrollModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCoVkYaUn1JpYzjlr2V7ynNpiDOi26p7bg',
    //   libraries: ['places', 'geometry']
    // }),
  ],
  declarations: [SocialListComponent, CompanyBusinessComponent, PrivateBusinessComponent, AddBusinessComponent, AnotherComponent, BusinessEventComponent, BusinessRequestComponent, OnePostComponent]
})
export class SocialModule { }
