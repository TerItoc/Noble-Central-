import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs';
import { DashboardSqlService } from '../dashboard-sql.service';
import { EmpleadoEvaluacion } from '../model/empleadoEvaluacion.model';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-empleado-dashboard',
  templateUrl: './empleado-dashboard.component.html',
  styleUrls: ['./empleado-dashboard.component.css']
})
export class EmpleadoDashboardComponent implements OnInit {


  constructor(
    private dsqls: DashboardSqlService,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private router: Router
  ) {}

  profile!: ProfileType;
  isAdmin = false;

  employecount = true;
  loading: boolean = true;

  validando: boolean;

  reporteTexto : string;
  confirmEvals : number[];

  allEvals : EmpleadoEvaluacion[];
  confirmedEvals : EmpleadoEvaluacion[];
  reportedEvals : EmpleadoEvaluacion[];

  nombreEmpleado : string = "NO HAY EMPLEADO";

  allChecked : boolean = true;
  isChecked : boolean = true;

  evalToReport : EmpleadoEvaluacion;
  checkboxEvalReport;

  ngOnInit(): void {
    this.loading = true;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.http.get(GRAPH_POINT).subscribe((profile) => {
          this.profile = profile;

          this.dsqls.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
            let value = Object.values(msg)[0];
            this.profile = profile

            if (value === 'No hay correo' || value === 'false') {
              this.getTeam();
              this.isAdmin = false;
              this.getTeam();
            } else {
              this.isAdmin = true;
              this.router.navigateByUrl('dashboard');
            }
          });
        });
      });
  }

  getTeam() {
    this.dsqls.getValidando().then((res) => {
      this.validando = res;
    });

    this.dsqls.getAllEmployeeEvals(this.profile.userPrincipalName).subscribe((res) => {
      this.allEvals = res;
      this.loading = false;
    });

  }
}
