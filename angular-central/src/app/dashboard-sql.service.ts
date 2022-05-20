import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ResultadoEquipos, Equipo } from './model/equipos.model';
import { ResultadoHuerfano, Huerfano } from './model/orphan.model';
import { ResultadoMakeTeams } from './model/response.model';
import { Relacion } from './model/evaluacion.model';
import { environment } from 'src/environments/environment';
import { EmpleadoEvaluacion } from './model/empleadoEvaluacion.model';
import { EvaluacionAEnviar } from './model/evaluacionEnviada.model';


@Injectable({
  providedIn: 'root'
})

export class DashboardSqlService {

  constructor(private http: HttpClient) {};
/*
  getCount1(){
    return this.http.get<ResultadoEquipos>(environment.backendUrl+'/getTeams').pipe(map((res) => {return res.equipos.}));
  }
*/
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

  getPendingEmployeeEvals(correo:string){
    let formData:FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', "false");

    return this.http.post<EmpleadoEvaluacion[]>(environment.backendUrl+'/getEmployeeEvals',formData);
  }

  getAllEmployeeEvals(correo : string){
    let formData:FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', "true");

    return this.http.post<EmpleadoEvaluacion[]>(environment.backendUrl+'/getEmployeeEvals',formData);
  }

  getEmployees(){
    return this.http.get<string[]>(environment.backendUrl+'/getEmployees');
  }

  postFile(file : File){
    let formData:FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ResultadoMakeTeams>(environment.backendUrl+'/makeTeams', formData);
  }

  addEval(empA,relacion,empB){
    let formData:FormData = new FormData();
    formData.append('empA', empA);
    formData.append('relacion', relacion);
    formData.append('empB', empB);

    return this.http.post(environment.backendUrl+'/addEvaluation', formData);
  }

  delEval(empA,relacion,empB){
    var relABorrar : Relacion = {
      empA : empA,
      relacion: relacion,
      empB: empB,
    };
    return this.http.post(environment.backendUrl+'/deleteEvaluation', relABorrar);
  }

  getIsAdmin(correo: string) {
    let emailData : FormData = new FormData();
    emailData.append('correo', correo);
    return this.http.post(environment.backendUrl+'/isAdmin', emailData);
  }

  postReport(evall : EmpleadoEvaluacion, report){
    evall.Reporte = report;
    return this.http.post(environment.backendUrl+'/generateReport',evall);
  }

  postConfirmEvals(evals){
    let formData:FormData = new FormData();
    formData.append("evals",evals);
    return this.http.post(environment.backendUrl+'/confirmEvals',evals);
  }

}
