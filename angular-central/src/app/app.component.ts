import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';

type ProfileType = {
  displayName ?: string;
  mail?: string;
  id?: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  version : string = "0.0.1";
  title = 'IPScentral';

  profile!: ProfileType;
  loginDisplay = false;

  isIframe = false;
  private _destroying$ = new Subject<void>();

  constructor(
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        )
      )
      .subscribe(() => {
        this.setLoginDisplay();
        if(this.loginDisplay) this.getProfile();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile() {
    this.http
      .get('https://graph.microsoft.com/v1.0/me')
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/login'
    })
  }
}