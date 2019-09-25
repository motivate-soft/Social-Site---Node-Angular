import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { JwtInterceptor } from './shared/services/jwt.interceptor';
import { ErrorInterceptor } from './shared/services/error.interceptor';
import { HttpXsrfInterceptor } from './shared/services/csrf.interceptor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
 
import { ToastrModule } from 'ngx-toastr';  
import { FormsModule } from '@angular/forms';


/**
 * Custom angular notifier options
 */

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule,
    ToastrModule.forRoot({
      closeButton: true
    }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
