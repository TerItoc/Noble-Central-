import { Component, OnInit } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Empleado } from '../model/empleado.model';
import { Equipo } from '../model/equipos.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  emp: Empleado[];
  emps: any;
  equiposSearch = [];
  huerfanosSearch = [];
  arrEmpleados: Empleado[];

  constructor(private dsqls: DashboardSqlService) {}

  ngOnInit() {
    this.dsqls.getEmps().subscribe((empleados) => {
      this.emp = empleados;
      this.dsqls.empData = empleados;
      this.arrEmpleados = empleados.sort();
    });

  }

  onSelectedOption(e) {
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dsqls.searchOption.length > 0) {
      this.emp = this.dsqls.filteredListOptions();
      this.emp.forEach((el) => {
        this.getTeamForName(el);
      });
    } else {
      this.emp = this.dsqls.empData;
    }
    this.equiposSearch = [];
    this.huerfanosSearch = [];
  }

  async findPerson(res, name) {
    return res.nombre === name ? true : false;
  }

  async getTeamForName(nom) {
    this.dsqls.getTeams().subscribe((res) => {
      console.log(res.filter((e) => e.nombre === nom))
      if (res.filter((e) => e.nombre === nom)) {
        this.equiposSearch = this.equiposSearch.concat(
          res.filter((e) => e.nombre === nom)
        );
        return;
      } else {
        this.dsqls.getOrphans().subscribe((res) => {
          if (res.filter((e) => e.nombreHuerfano === nom)) {
            this.huerfanosSearch = this.huerfanosSearch.concat(
              res.filter((e) => e.nombreHuerfano === nom)
            );
          }
        });
      }
    });
  }
}
