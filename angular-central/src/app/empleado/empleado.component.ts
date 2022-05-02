import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-empleados',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
})
export class EmpleadoComponent implements OnInit {

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
  pendingEvals : EmpleadoEvaluacion[];

  nombreEmpleado : string = "NO HAY EMPLEADO";

  allChecked : boolean = true;
  isChecked : boolean = true;

  evalToReport : EmpleadoEvaluacion;
  checkboxEvalReport;

  Uncheck(isChecked){
    if(isChecked==false){
      return this.allChecked=false;
    }
    else{
      return this.allChecked=true;
    }
  }

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
      this.pendingEvals = res.filter(x => x.Estatus == 0);
      
      if(this.pendingEvals.length > 0){
        this.router.navigateByUrl('empleado');
      }
      
      this.confirmedEvals = res.filter(x => x.Estatus == 1);
      this.reportedEvals = res.filter(x => x.Estatus == 2);

      this.loading = false;
    });
  }

  setReporteTexto(texto){
    this.reporteTexto = texto; 
  }

  setReport(empleadoEvaluacion){
    this.evalToReport = empleadoEvaluacion;
  }

  sendReport(){
    console.log(this.evalToReport, this.reporteTexto);
    this.dsqls.postReport(this.evalToReport, this.reporteTexto).subscribe((res)=>{
      this.loading = true;
      window.location.href = 'empleado';
    });
  }

  sendConfirmedEvals(){
    this.confirmEvals = this.pendingEvals.map(function(i) {
      return i.EvaluacionID;
    });
    this.dsqls.postConfirmEvals(this.confirmEvals).subscribe((res)=>{
      this.loading = true;
      window.location.href = "empleado";
    });
  }
}
