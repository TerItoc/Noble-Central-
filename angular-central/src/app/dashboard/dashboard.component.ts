import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventType,
  EventMessage,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

type profileType = {
  givenName?: string
  surname?: string
  userPrincipalName?: string
  id?: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loginDisplay = false;
  profile!: profileType;

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None)
    )
    .subscribe(() => {
      this.setLoginDisplay();
      this.getProfile();
    })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile() {
    this.http.get(GRAPH_POINT).subscribe(profile => {
      this.profile = profile;
    })
  }
}
