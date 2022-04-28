import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DropdownPersonaComponent } from './dropdown-persona/dropdown-persona.component';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  MsalModule,
  MsalRedirectComponent,
  MsalGuard,
  MsalInterceptor,
} from '@azure/msal-angular';


import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { DropdownHuerfanoComponent } from './dropdown-huerfano/dropdown-huerfano.component';
import { SearchComponent } from './search/search.component';
import { BarComponent } from './bar/bar.component';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminEvComponent,
    EmpleadoComponent,
    DropdownPersonaComponent,
    FileUploadComponent,
    DropdownHuerfanoComponent,
    EmpleadoComponent,
    SearchComponent,
    BarComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    }),
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: 'bed5c4ff-8b0f-4770-bf78-53ba11750473',
          authority:
            'https://login.microsoftonline.com/c65a3ea6-0f7c-400b-8934-5a6dc1705645',
          redirectUri: 'http://localhost:4200',
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ]),
      }
    ),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  exports: [],
})
export class AppModule {}
