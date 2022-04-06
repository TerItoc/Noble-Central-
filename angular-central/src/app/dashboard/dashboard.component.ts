import { Component, OnInit } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dsqls : DashboardSqlService) {};

  equipos = [];
  counter: number = 0;
  

  ngOnInit(): void {

    this.dsqls.getTeams().subscribe(res => {
      this.equipos = res;
      console.log(res);
    });

    

  }

  getID() : string {
    return "id";
  }

}
