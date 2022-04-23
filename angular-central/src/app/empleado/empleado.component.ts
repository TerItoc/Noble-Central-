import { Component, OnInit } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { EmpleadoEvaluacion } from '../model/empleadoEvaluacion.model';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  employecount=true;
  loading : boolean = true;
  correo : string = "A01114959@tec.mx";
  myEvals : EmpleadoEvaluacion[];
  nombreEmpleado : string = "NO HAY EMPLEADO";
  allChecked : boolean = true;


  constructor(private dsqls : DashboardSqlService,) { }

  ngOnInit(): void {
    this.loading=true;

    this.dsqls.getEmployeeEval(this.correo).subscribe(res => {
      this.myEvals = res;
      this.loading = false;
      //console.log(this.myEvals);

    })

  }

  toggleEditable(event) {
    if ( !event.target.checked ) {
        this.allChecked = false;
   }
  }

}

