import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ResultadoEquipos, Equipo } from './model/equipos.model';
import { ResultadoHuerfano, Huerfano } from './model/orphan.model';
import { Relacion } from './model/evaluacion.model';
import { json } from 'body-parser';


@Injectable({
  providedIn: 'root'
})

export class DashboardSqlService {

  constructor(private http: HttpClient) {};

  getTeams() {
    return this.http.get<ResultadoEquipos>('http://localhost:3000/getTeams').pipe(map((res) => {return res.equipos}));
  }

  getOrphans() {
    return this.http.get<ResultadoHuerfano>('http://localhost:3000/getOrphans').pipe(map((res) => {return res.huerfanos}));
  }

  getIfTeam(){
      return this.http.get<ResultadoHuerfano>('http://localhost:3000/ifTeam');
  }

  delEval(empA,relacion,empB){

    const httpOptions = {headers : new HttpHeaders({
      empA : empA,
      relacion: relacion,
      empB: empB,

    })};

    var relABorrar : Relacion = {
      empA : empA,
      relacion: relacion,
      empB: empB,
    };


    return this.http.post('http://localhost:3000/deleteEvaluation', relABorrar);
  }

}
