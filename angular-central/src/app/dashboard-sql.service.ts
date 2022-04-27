import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ResultadoEquipos, Equipo } from './model/equipos.model';
import { ResultadoHuerfano, Huerfano } from './model/orphan.model';
import { ResultadoMakeTeams } from './model/response.model';
import { Relacion } from './model/evaluacion.model';
import { json } from 'body-parser';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { RequestOptions } from 'https';
import { EmpleadoEvaluacion } from './model/empleadoEvaluacion.model';
import { EvaluacionAEnviar } from './model/evaluacionEnviada.model';


@Injectable({
  providedIn: 'root'
})

export class DashboardSqlService {

  constructor(private http: HttpClient) {};

  getTeams() {
    return this.http.get<ResultadoEquipos>(environment.backendUrl+'/getTeams').pipe(map((res) => {return res.equipos}));
  }

  getOrphans() {
    return this.http.get<ResultadoHuerfano>(environment.backendUrl+'/getOrphans').pipe(map((res) => {return res.huerfanos}));
  }

  getIfTeam(){
    return this.http.get<boolean>(environment.backendUrl+'/ifTeam').toPromise();
  }

  getValidando(){
    return this.http.get<boolean>(environment.backendUrl+'/ifValidando').toPromise();
  }

  publishTeams(){
    return this.http.get<Response>(environment.backendUrl+'/publishTeams');
  }

  getEmployeeEval(correo:string){
    let formData:FormData = new FormData();
    formData.append('correo', correo);

    return this.http.post<EmpleadoEvaluacion[]>(environment.backendUrl+'/getEmployeeEvals',formData);
  }

  getEmployees(){
    return this.http.get<string[]>(environment.backendUrl+'/getEmployees');
  }

  postFile(file : File){
    let formData:FormData = new FormData();
    formData.append('file', file, file.name);
    
    //const headers : Headers = new Headers();
    //headers.append('Content-Type', 'text');
    //let options : RequestOptions = new RequestOptions({ headers: headers });
    //formData.append(headers);

    return this.http.post<ResultadoMakeTeams>(environment.backendUrl+'/makeTeams', formData);
  }

  postChangeEvalEstatus(evals : EvaluacionAEnviar){
    let formData:FormData = new FormData();
  }

  addEval(empA,relacion,empB){

    var relAAgregar : Relacion = {
      empA : empA,
      relacion: relacion,
      empB: empB,
    };


    return this.http.post(environment.backendUrl+'/addEvaluation', relAAgregar);
  }

  delEval(empA,relacion,empB){

    var relABorrar : Relacion = {
      empA : empA,
      relacion: relacion,
      empB: empB,
    };


    return this.http.post(environment.backendUrl+'/deleteEvaluation', relABorrar);
  }

}
