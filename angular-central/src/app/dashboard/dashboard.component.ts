import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MsalBroadcastService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  profile!: ProfileType;
  isAdmin: boolean = false;

  huerfanos = [];
  equipos = [];
  counter: number = 0;
  loading: boolean = true;
  arrEmpleados: string[];

  validando: boolean = true;

  ifTeam: boolean = false;

  @ViewChild('Huerfanos') Huer:any;

  constructor(
    private dsqls: DashboardSqlService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
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
        this.http.get(GRAPH_POINT).subscribe((profile) => {
          this.profile = profile;

          this.dsqls
            .getIsAdmin(this.profile.userPrincipalName)
            .subscribe((msg) => {
              let value = Object.values(msg)[0];
              if (value === 'No hay correo' || value === 'false') {
                this.isAdmin = false;
                this.router.navigateByUrl('empleado');
              } else {
                this.isAdmin = true;
                this.createTeams();
              }
            });
        });
      });
  }

  refresh(): void {
    window.location.reload();
  }

  publishTeams() {
    this.loading = true;
    this.dsqls.publishTeams().subscribe((res) => {
      this.loading = false;
      this.refresh();
    });
  }

  saveTeams() {}

  goBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  goTop() {
    window.scrollTo(0, 0);
  }

  createTeams() {
    this.loading = true;
    this.dsqls.getIfTeam().subscribe((res) => {
      this.ifTeam = res;

      if (this.ifTeam) {
        this.dsqls.getValidando().subscribe((res) => {
          this.validando = res;
        });

        this.dsqls.getTeams().subscribe((res) => {
          this.equipos = res;
        });

        this.dsqls.getEmployees().subscribe((res) => {
          this.arrEmpleados = res.sort();
        });

        this.dsqls.getOrphans().subscribe((res) => {
          this.huerfanos = res;
          this.loading = false;
        });
      } else {
        this.router.navigateByUrl('adminEV');
      }
    });
  }
  goTarget(el: HTMLElement){
    el.scrollIntoView();
  }

}
