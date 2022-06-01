import { Component, Input, OnInit } from '@angular/core';
import { Evaluacion } from '../model/equipos.model';
import { DashboardSqlService } from '../dashboard-sql.service';

@Component({
  selector: 'app-dropdown-persona',
  templateUrl: './dropdown-persona.component.html',
  styleUrls: ['./dropdown-persona.component.css']
})

export class DropdownPersonaComponent implements OnInit {

  @Input() nombre : string;
  @Input() evaluadores : Evaluacion[];
  @Input() id : number;
  @Input() arrEmpleados : string[];

  arrRelaciones: string[] = ["Peer to Peer","Lider a Equipo","Equipo a Lider"]; 

  isError: boolean = false;
  isSamePerson: boolean = false;

  nombreDelete : string;
  tipoRelacionDelete : string;
  nombreEvaluadorDelete : string;

  nombreAgregar : string;
  tipoRelacionAgregar : string;
  nombreEvaluadorAgregar : string;

  selectedEvaluador: number = 0;
  selectedRelacion: number = 0;

  
  constructor (private dsqls : DashboardSqlService) {
    
  };

  ngOnInit(): void {
    //console.log(this.arrEmpleados);
  }

  refresh(): void {
    window.location.reload();
  }

  setNombreAgregar(nombre) : void {
    this.nombreAgregar = nombre;
  }

  setRelacionAgregar(relacion) : void {
    this.tipoRelacionAgregar = relacion;
  } 

  setEvaluadorAgregar(nombreEvaluadorAgregar) : void {
    this.nombreEvaluadorAgregar = nombreEvaluadorAgregar;
  }

  saveEval() : void {
    console.log(this.nombreAgregar,this.tipoRelacionAgregar,this.nombreEvaluadorAgregar);
    if(this.nombreEvaluadorAgregar == "0" || this.tipoRelacionAgregar == "0") {
      this.isError = true;
      return;
    }
    if(this.nombreEvaluadorAgregar === this.nombreAgregar) {
      this.isSamePerson = true;
      this.isError = false;
      return
    }
    this.isError = false;
    this.dsqls.addEval(this.nombreAgregar,this.tipoRelacionAgregar,this.nombreEvaluadorAgregar).subscribe((res) => {this.refresh()});
  }

  setDelete(nombre,tipoRelacion,nombreEvaluador): void {
    this.nombreDelete = nombre;
    this.tipoRelacionDelete = tipoRelacion;
    this.nombreEvaluadorDelete = nombreEvaluador;
  }

  delEval(empA,relacion,empB): void {
    console.log(empA,relacion,empB);
    this.dsqls.delEval(empA,relacion,empB).subscribe((res) => {this.refresh()});
  }

  areYouSure(): void {
    //popup here
  }

}
