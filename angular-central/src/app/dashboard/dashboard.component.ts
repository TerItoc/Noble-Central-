import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Router } from '@angular/router';


type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string; 
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

//TODO Modificar para que se despliegue la informacion por empleado
export class DashboardComponent implements OnInit {

  huerfanos = [];
  equipos = [];
  counter: number = 0;
  loading: boolean = true;
  arrEmpleados: string[];

  ifTeam : boolean = false;

  constructor(
    private dsqls : DashboardSqlService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.loading=true;

    this.dsqls.getIfTeam().then(res => {
      this.ifTeam = res;

      if(this.ifTeam){
        this.dsqls.getTeams().subscribe(res => {
          this.equipos = res;
        });
    
        this.dsqls.getEmployees().subscribe(res => {
          this.arrEmpleados = res.sort();
        })
    
        this.dsqls.getOrphans().subscribe(res => {
          this.huerfanos = res;
          this.loading = false;
        });
      }
  
      else{
        this.router.navigateByUrl('adminEV');
      }
    })
  }

  goBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }

  goTop(){
    window.scrollTo(0,0);
  }

}
