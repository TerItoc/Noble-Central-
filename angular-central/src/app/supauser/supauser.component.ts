import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardSqlService } from '../dashboard-sql.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-supauser',
  templateUrl: './supauser.component.html',
  styleUrls: ['./supauser.component.css']
})
export class SUPAUSERComponent implements OnInit {

  constructor(
    private dsqls: DashboardSqlService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  success : boolean = false;

  adminform= new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl('')
  });

  onSubmit(){
    this.dsqls.insertAdmin(this.adminform.value).subscribe((res) => {
      this.success = res['success'];
      console.log(res);

      if(this.success){
        this.toastr.success('', "Se inserto un administrador");
      } else {
        this.toastr.error('', "Hubo un error al crear un administrador");
      }
    });

  }



}
