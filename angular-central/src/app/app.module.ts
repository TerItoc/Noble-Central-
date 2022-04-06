import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoTEAMLESSComponent } from './empleado-teamless/empleado-teamless.component';

import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { DropdownPersonaComponent } from './dropdown-persona/dropdown-persona.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

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
    DropdownPersonaComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    FormsModule,
    FileUploadModule,
    AppRoutingModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: "bed5c4ff-8b0f-4770-bf78-53ba11750473",
        authority: "c65a3ea6-0f7c-400b-8934-5a6dc1705645",
        redirectUri: "http://localhost:4200/dashboard"
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), null, null),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule { }