import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminSqlService {
  constructor(private http: HttpClient) {}

  insertAdmin(json) {
    console.log(json);
    return this.http.post(
      environment.backendUrl + environment.adminRoute + '/insertAdmin',
      json
    );
  }

  getIsAdmin(correo: string) {
    let emailData: FormData = new FormData();
    emailData.append('correo', correo);
    return this.http.post(
      environment.backendUrl + environment.empleadoRoute + '/isAdmin',
      emailData
    );
  }
}
