import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
@NgModule({ 
  
  declarations: [
    AppComponent,
    FileUploadComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
  exports: [FileUploadComponent],
})
export class AppModule { }