import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { DashboardSqlService } from '../dashboard-sql.service';
import { EmpleadoEvaluacion } from '../model/empleadoEvaluacion.model';
import { TeamSqlService } from '../team-sql.service';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
})
export class EmpleadoComponent implements OnInit {
  isError: boolean = false;

  inputField;

  constructor(
    private dsqls: DashboardSqlService,
    private teamSql: TeamSqlService,
    private http: HttpClient,
    private router: Router
  ) {}

  profile!: ProfileType;
  isAdmin = false;

  employecount = true;
  loading: boolean = true;

  validando: boolean;

  reporteTexto: string;
  confirmEvals: number[];

  allEvals: EmpleadoEvaluacion[];
  confirmedEvals: EmpleadoEvaluacion[];
  reportedEvals: EmpleadoEvaluacion[];
  pendingEvals: EmpleadoEvaluacion[];

  nombreEmpleado: string = 'NO HAY EMPLEADO';

  allChecked: boolean = true;
  isChecked: boolean = true;

  evalToReport: EmpleadoEvaluacion;
  checkboxEvalReport;

  Uncheck(isChecked) {
    if (isChecked == false) {
      return (this.allChecked = false);
    } else {
      return (this.allChecked = true);
    }
  }

  ngOnInit(): void {
    this.loading = true;

    this.http.get(GRAPH_POINT).subscribe((profile) => {
      this.profile = profile;
      this.getTeam();
      /* this.dsqls.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
            let value = Object.values(msg)[0];
            this.profile = profile

            if (value === 'No hay correo' || value === 'false') {
              //this.isAdmin = false;
              this.getTeam();
            } else {
              //this.isAdmin = true;
              this.router.navigateByUrl('dashboard');
            }
          });
        }); */
    });
  }

  getTeam() {
    this.teamSql.getValidando().then((res) => {
      this.validando = res;
    });

    this.dsqls
      .getAllEmployeeEvals(this.profile.userPrincipalName)
      .subscribe((res) => {
        this.allEvals = res;
        this.evalToReport = this.allEvals[0];
        this.pendingEvals = res.filter((x) => x.Estatus == 0);

        if (this.pendingEvals.length > 0) {
          this.router.navigateByUrl('empleado');
        }

        this.confirmedEvals = res.filter((x) => x.Estatus == 1);
        this.reportedEvals = res.filter((x) => x.Estatus == 2);

        this.loading = false;
      });
  }

  setReporteTexto(texto) {
    this.reporteTexto = texto;
  }

  setReport(empleadoEvaluacion) {
    this.evalToReport = empleadoEvaluacion;
  }

  sendReport() {
    this.inputField = document.querySelector('.form-control').classList;
    if (this.reporteTexto === undefined) {
      this.isError = true;
      this.inputField.add('is-invalid');
      return;
    }
    this.isError = false;
    this.dsqls
      .postReport(this.evalToReport, this.reporteTexto)
      .subscribe((res) => {
        this.loading = true;
        window.location.reload();
      });
  }

  sendConfirmedEvals() {
    this.loading = true;
    this.confirmEvals = this.pendingEvals.map(function (i) {
      return i.EvaluacionID;
    });
    this.dsqls.postConfirmEvals(this.confirmEvals).subscribe((res) => {
      window.location.reload();
    });
  }
}
