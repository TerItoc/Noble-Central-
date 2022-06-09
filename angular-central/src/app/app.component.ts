import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { DashboardSqlService } from './dashboard-sql.service';

type ProfileType = {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
};

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  version: string = '0.0.1';
  title = 'IPScentral';

  profile!: ProfileType;
  loginDisplay = false;
  isAdmin = false;

  isIframe = false;
  private _destroying$ = new Subject<void>();

  constructor(
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private http: HttpClient,
    private dsqls: DashboardSqlService
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        if (this.loginDisplay) this.getProfile();
      });
    this.http.get(GRAPH_POINT).subscribe((profile) => {
      this.profile = profile;

      this.dsqls.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
        let value = Object.values(msg)[0];
        if (value === 'No hay correo' || value === 'false') {
          this.isAdmin = false;
          return;
        }
        this.isAdmin = true;
      });
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
      postLogoutRedirectUri: 'http://localhost:4200/login',
    });
  }
}
