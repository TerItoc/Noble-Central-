import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultadoEquipos } from './model/equipos.model';
import { ResultadoHuerfano } from './model/orphan.model';
import { ResultadoMakeTeams } from './model/response.model';

@Injectable({
  providedIn: 'root',
})
export class TeamSqlService {
  constructor(private http: HttpClient) {}

  getTeams() {
    return this.http
      .get<ResultadoEquipos>(
        environment.backendUrl + environment.teamsRoute + '/getTeams'
      )
      .pipe(
        map((res) => {
          return res.equipos;
        })
      );
  }

  getOrphans() {
    return this.http
      .get<ResultadoHuerfano>(
        environment.backendUrl + environment.teamsRoute + '/getOrphans'
      )
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
      .get<boolean>(
        environment.backendUrl + environment.teamsRoute + '/ifValidando'
      )
      .toPromise();
  }

  publishTeams() {
    return this.http.get<Response>(
      environment.backendUrl + environment.teamsRoute + '/publishTeams'
    );
  }

  getTeamsMatrix() {
    return this.http.get(
      environment.backendUrl + environment.teamsRoute + '/getTeamsMatrix'
    );
  }

  postFile(file: File) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ResultadoMakeTeams>(
      environment.backendUrl + environment.teamsRoute + '/makeTeams',
      formData
    );
  }
}
