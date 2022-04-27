import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, Input, OnInit, Output, HostListener } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, noop } from 'rxjs';
import { EventEmitter } from 'stream';
import { DashboardSqlService } from '../dashboard-sql.service';
import { EmpleadoEvaluacion } from '../model/empleadoEvaluacion.model';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}
@Component({
  selector: 'app-empleados',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
})

export class EmpleadoComponent implements OnInit {
  profile!: ProfileType;

  employecount=true;
  loading : boolean = true;

  validando : boolean;

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
    private dsqls : DashboardSqlService,
    private authService : MsalService,
    private msalBroadcastService : MsalBroadcastService,
    private http : HttpClient) { }

  ngOnInit(): void {
    this.loading=true;


    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg : EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((result: EventMessage) => {
      console.log(result);
    });

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None)
    )
      .subscribe(() => {
          this.http.get("https://graph.microsoft.com/v1.0/me").subscribe(profile => {

            this.profile = profile

            this.dsqls.getValidando().then(res => {
              this.validando = res;
            })

            //this.correo
            this.dsqls.getEmployeeEval(this.profile.userPrincipalName).subscribe(res => {
              this.myEvals = res;
              this.loading = false;
              //console.log(this.myEvals);

            })

      })
    });

  }

}

