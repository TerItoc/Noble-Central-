import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dsqls : DashboardSqlService) {};

  huerfanos = [];
  equipos = [];
  counter: number = 0;
  loading: boolean = true;

  ngOnInit(): void {
    this.loading=true;

    this.dsqls.getTeams().subscribe(res => {
      this.equipos = res;
    });

    this.dsqls.getOrphans().subscribe(res => {
      this.huerfanos = res;
      this.loading = false;
    });

  }

  getID() : string {
    return "id";
  }

}
