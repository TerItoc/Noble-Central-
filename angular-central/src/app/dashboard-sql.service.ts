import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResultadoEquipos, Equipo } from './model/equipos.model';
import { ResultadoHuerfano, Huerfano } from './model/orphan.model';
import { ResultadoMakeTeams } from './model/response.model';
import { Relacion } from './model/evaluacion.model';
import { environment } from 'src/environments/environment';
import { EmpleadoEvaluacion } from './model/empleadoEvaluacion.model';
import { EvaluacionAEnviar } from './model/evaluacionEnviada.model';
import { Empleado } from './model/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardSqlService {
  searchOption = [];
  public empData: Empleado[];

  constructor(private http: HttpClient) {}

  getStatusTotal() {
    return this.http.get(environment.backendUrl + environment.evaluacionesRoute + '/getTotalStatus').pipe(
      map((res) => {
        let status_array = res['recordset'];
        const map = status_array.map((e) => {
          let Status = e['Estatus'];
          let Value = e['Total'];
          if (Status == -1) return { name: 'Sin Publicar', value: Value };
          else if (Status == 0) return { name: 'Pendiente', value: Value };
          else if (Status == 1) return { name: 'Validando', value: Value };
          else return { name: 'Reporte', value: Value };
        });
        return map;
      })
    );
  }

  getTeams() {
    return this.http
      .get<ResultadoEquipos>(environment.backendUrl + environment.teamsRoute + '/getTeams')
      .pipe(
        map((res) => {
          return res.equipos;
        })
      );
  }

  getOrphans() {
    return this.http
      .get<ResultadoHuerfano>(environment.backendUrl + environment.teamsRoute + '/getOrphans')
      .pipe(
        map((res) => {
          return res.huerfanos;
        })
      );
  }

  getIfTeam() {
    return this.http
      .get<boolean>(environment.backendUrl + environment.teamsRoute + '/ifTeam')
      .toPromise();
  }

  getValidando() {
    return this.http
      .get<boolean>(environment.backendUrl + environment.teamsRoute + '/ifValidando')
      .toPromise();
  }

  publishTeams() {
    return this.http.get<Response>(environment.backendUrl + environment.teamsRoute + '/publishTeams');
  }

  getPendingEmployeeEvals(correo: string) {
    let formData: FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', 'false');

    return this.http.post<EmpleadoEvaluacion[]>(
      environment.backendUrl + environment.empleadoRoute + '/getEmployeeEvals',
      formData
    );
  }

  getAllEmployeeEvals(correo: string) {
    let formData: FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', 'true');

    return this.http.post<EmpleadoEvaluacion[]>(
      environment.backendUrl + environment.empleadoRoute + '/getEmployeeEvals',
      formData
    );
  }

  getEmployees() {
    return this.http.get<string[]>(environment.backendUrl + environment.empleadoRoute + '/getEmployees');
  }

  postFile(file: File) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ResultadoMakeTeams>(
      environment.backendUrl + environment.teamsRoute + '/makeTeams',
      formData
    );
  }

  addEval(empA, relacion, empB) {
    let formData: FormData = new FormData();
    formData.append('empA', empA);
    formData.append('relacion', relacion);
    formData.append('empB', empB);

    return this.http.post(environment.backendUrl + environment.evaluacionesRoute + '/addEvaluation', formData);
  }

  delEval(empA, relacion, empB) {
    var relABorrar: Relacion = {
      empA: empA,
      relacion: relacion,
      empB: empB,
    };
    return this.http.post(
      environment.backendUrl + environment.evaluacionesRoute + '/deleteEvaluation',
      relABorrar
    );
  }

  getIsAdmin(correo: string) {
    let emailData: FormData = new FormData();
    emailData.append('correo', correo);
    return this.http.post(environment.backendUrl + environment.empleadoRoute + '/isAdmin', emailData);
  }

  getEmps(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(environment.backendUrl + environment.empleadoRoute + '/getEmployees');
  }

  filteredListOptions() {
    let emps = this.empData;
    let filteredPostsList = [];
    for (let emp of emps) {
      for (let options of this.searchOption) {
        if (options === emp) {
          filteredPostsList.push(emp);
        }
      }
    }
    return filteredPostsList;
  }

  postReport(evall: EmpleadoEvaluacion, report) {
    evall.Reporte = report;
    return this.http.post(environment.backendUrl + environment.evaluacionesRoute + '/generateReport', evall);
  }

  postConfirmEvals(evals) {
    let formData: FormData = new FormData();
    formData.append('evals', evals);
    return this.http.post(environment.backendUrl + environment.evaluacionesRoute + '/confirmEvals', evals);
  }

  getTeamsMatrix() {
    return this.http.get(environment.backendUrl + environment.teamsRoute + '/getTeamsMatrix');
  }

  insertAdmin(json) {
    console.log(json);
    return this.http.post(environment.backendUrl + environment.adminRoute + '/insertAdmin', json);
  }
}
