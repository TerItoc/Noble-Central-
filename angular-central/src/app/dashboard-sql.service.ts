import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Relacion } from './model/evaluacion.model';
import { environment } from 'src/environments/environment';
import { EmpleadoEvaluacion } from './model/empleadoEvaluacion.model';
import { Empleado } from './model/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardSqlService {
  searchOption = [];
  public empData: Empleado[];

  constructor(private http: HttpClient) {}

  getStatusTotal() {
    return this.http
      .get(
        environment.backendUrl +
          environment.evaluacionesRoute +
          '/getTotalStatus'
      )
      .pipe(
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

  getPendingEmployeeEvals(correo: string) {
    let formData: FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', 'false');

    return this.http.post<EmpleadoEvaluacion[]>(
      environment.backendUrl +
        environment.evaluacionesRoute +
        '/getEmployeeEvals',
      formData
    );
  }

  getAllEmployeeEvals(correo: string) {
    let formData: FormData = new FormData();
    formData.append('correo', correo);
    formData.append('all', 'true');

    return this.http.post<EmpleadoEvaluacion[]>(
      environment.backendUrl +
        environment.evaluacionesRoute +
        '/getEmployeeEvals',
      formData
    );
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

  postConfirmEvals(evals) {
    let formData: FormData = new FormData();
    formData.append('evals', evals);
    return this.http.post(
      environment.backendUrl + environment.evaluacionesRoute + '/confirmEvals',
      evals
    );
  }

  addEval(empA, relacion, empB) {
    let formData: FormData = new FormData();
    formData.append('empA', empA);
    formData.append('relacion', relacion);
    formData.append('empB', empB);

    return this.http.post(
      environment.backendUrl + environment.evaluacionesRoute + '/addEvaluation',
      formData
    );
  }

  delEval(empA, relacion, empB) {
    var relABorrar: Relacion = {
      empA: empA,
      relacion: relacion,
      empB: empB,
    };
    return this.http.post(
      environment.backendUrl +
        environment.evaluacionesRoute +
        '/deleteEvaluation',
      relABorrar
    );
  }

  postReport(evall: EmpleadoEvaluacion, report) {
    evall.Reporte = report;
    return this.http.post(
      environment.backendUrl +
        environment.evaluacionesRoute +
        '/generateReport',
      evall
    );
  }
}
