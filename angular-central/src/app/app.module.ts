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
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoTEAMLESSComponent } from './empleado-teamless/empleado-teamless.component';


@NgModule({ 
  
  declarations: [
    AppComponent,
    FileUploadComponent,
    LoginComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    AdminEvComponent,
    EmpleadoTEAMLESSComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    FormsModule,
    FileUploadModule,
    AppRoutingModule
  ],

  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule { }