import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from './model/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoSqlService {
  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get<string[]>(
      environment.backendUrl + environment.empleadoRoute + '/getEmployees'
    );
  }
  getEmps(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(
      environment.backendUrl + environment.empleadoRoute + '/getEmployees'
    );
  }
}
