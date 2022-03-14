import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './file-upload/file-upload.component';


@NgModule({ 
  
  declarations: [
    AppComponent,
    FileUploadComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    FormsModule,
    FileUploadModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule { }