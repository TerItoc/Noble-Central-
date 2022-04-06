import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ResultadoEquipos, Equipo } from './model/equipos.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardSqlService {

  constructor(private http: HttpClient) {};

  getTeams() {
    return this.http.get<ResultadoEquipos>('http://localhost:3000/getTeams').pipe(map((res) => {return res.equipos}));
  }

}
