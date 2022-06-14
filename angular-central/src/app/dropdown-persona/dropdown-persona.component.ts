import { Component, Input, OnInit } from '@angular/core';
import { Evaluacion } from '../model/equipos.model';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Empleado } from '../model/empleado.model';
import { TeamSqlService } from '../team-sql.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dropdown-persona',
  templateUrl: './dropdown-persona.component.html',
  styleUrls: ['./dropdown-persona.component.css'],
})
export class DropdownPersonaComponent implements OnInit {
  @Input() nombre: string;
  @Input() evaluadores: Evaluacion[];
  @Input() id: number;
  @Input() arrEmpleados: Empleado[];

  arrRelaciones: string[] = [
    'Peer to Peer',
    'Lider a Equipo',
    'Equipo a Lider',
  ];

  isError: boolean = false;
  isSamePerson: boolean = false;
  isMember: boolean = false;

  nombreDelete: string;
  tipoRelacionDelete: string;
  nombreEvaluadorDelete: string;

  nombreAgregar: string;
  tipoRelacionAgregar: string;
  nombreEvaluadorAgregar: string;

  selectedEvaluador: number = 0;
  selectedRelacion: number = 0;

  constructor(
    private dsqls: DashboardSqlService,
    private teamSql: TeamSqlService
  ) {}

  ngOnInit(): void {}

  refresh(): void {
    window.location.reload();
  }

  setNombreAgregar(nombre): void {
    this.nombreAgregar = nombre;
  }

  setRelacionAgregar(relacion): void {
    this.tipoRelacionAgregar = relacion;
  }

  setEvaluadorAgregar(nombreEvaluadorAgregar): void {
    this.nombreEvaluadorAgregar = nombreEvaluadorAgregar;
  }

  saveEval(): void {
    this.teamSql.getTeamsMatrix().subscribe((evals) => {
      let team = Object.values(evals).filter(e => e[0] === this.nombreAgregar);

      if (this.nombreEvaluadorAgregar == '0' || this.tipoRelacionAgregar == '0') {
        this.isError = true;
        this.isMember = false;
        this.isSamePerson = false;
        return;
      }

      if (this.nombreEvaluadorAgregar === this.nombreAgregar) {
        this.isSamePerson = true;
        this.isError = false;
        this.isMember = false;
        return;
      }

      for(let i = 0; i < team.length; i++) {
        let evaluation = team[i];
        if(evaluation[2] == this.nombreEvaluadorAgregar) {
          this.isError = false;
          this.isSamePerson = false;
          this.isMember = true;
          return;
        }
      }

      this.isError = false;

      this.dsqls
        .addEval(
          this.nombreAgregar,
          this.tipoRelacionAgregar,
          this.nombreEvaluadorAgregar
        )
        .subscribe((res) => {
          this.refresh();
        });
    });
  }

  setDelete(nombre, tipoRelacion, nombreEvaluador): void {
    this.nombreDelete = nombre;
    this.tipoRelacionDelete = tipoRelacion;
    this.nombreEvaluadorDelete = nombreEvaluador;
  }

  delEval(empA, relacion, empB): void {
    console.log(empA, relacion, empB);
    this.dsqls.delEval(empA, relacion, empB).subscribe((res) => {
      this.refresh();
    });
  }

  areYouSure(): void {
    //popup here
  }
}
