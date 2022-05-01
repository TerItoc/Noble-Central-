import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  profile!: ProfileType;
  isAdmin = false;

  employecount = true;
  loading: boolean = true;

  validando: boolean;


  myEvals : EmpleadoEvaluacion[];
  nombreEmpleado : string = "NO HAY EMPLEADO";

  allChecked : boolean = true;
  isChecked : boolean = true;



  Uncheck(isChecked){
    if(isChecked==false){
      return this.allChecked=false;
    }
    else{
      return this.allChecked=true;
    }
  }

  constructor(
    private dsqls: DashboardSqlService,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

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

    this.dsqls
      .getEmployeeEval(this.profile.userPrincipalName)
      .subscribe((res) => {
        this.myEvals = res;
        this.loading = false;
      });
  }

}
