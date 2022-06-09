import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardSqlService } from '../dashboard-sql.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

@Component({
  selector: 'app-supauser',
  templateUrl: './supauser.component.html',
  styleUrls: ['./supauser.component.css'],
})
export class SUPAUSERComponent implements OnInit {
  profile!: ProfileType;
  isAdmin = false;
  constructor(
    private dsqls: DashboardSqlService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get(GRAPH_POINT).subscribe((profile) => {
      this.profile = profile;

      this.dsqls.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
        let value = Object.values(msg)[0];
        if (value === 'No hay correo' || value === 'false') {
          this.isAdmin = false;
          this.router.navigateByUrl('empleado');
          return;
        }
        this.isAdmin = true;
      });
    });
  }

  success: boolean = false;

  adminform = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
  });

  onSubmit() {
    this.dsqls.insertAdmin(this.adminform.value).subscribe((res) => {
      this.success = res['success'];
      console.log(res);

      if (this.success) {
        this.toastr.success('', 'Se inserto un administrador');
      } else {
        this.toastr.error('', 'Hubo un error al crear un administrador');
      }
    });
  }
}
