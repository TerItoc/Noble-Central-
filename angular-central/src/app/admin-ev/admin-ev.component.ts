import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { DashboardSqlService } from '../dashboard-sql.service';

type ProfileType = {
  userPrincipalName ?: string
}

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-admin-ev',
  templateUrl: './admin-ev.component.html',
  styleUrls: ['./admin-ev.component.css'],
})
export class AdminEvComponent implements OnInit {
  profile!: ProfileType;
  isAdmin = false;

  constructor(
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private dsqls: DashboardSqlService,
    private router: Router
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
        this.http.get(GRAPH_POINT).subscribe((profile) => {
          this.profile = profile;

          this.dsqls
            .getIsAdmin(this.profile.userPrincipalName)
            .subscribe((msg) => {
              let value = Object.values(msg)[0];
              if (value === 'No hay correo') {
                this.isAdmin = false;
                this.router.navigateByUrl('empleado');
              } else {
                this.isAdmin = true;
              }
            });
        });
      });
  }
}
