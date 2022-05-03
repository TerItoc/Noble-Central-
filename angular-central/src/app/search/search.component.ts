import { Component, OnInit } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Empleado } from '../model/empleado.model'
import { Equipo } from '../model/equipos.model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  emp: Empleado[]
  emps : any;
  equipos = [];
  arrEmpleados: string[];

  constructor(
    private dsqls: DashboardSqlService
  ) { }

  ngOnInit() {
    this.dsqls.getEmps().subscribe(empleados => {
      this.emp = empleados
      this.dsqls.empData = empleados
    });

    this.dsqls.getEmployees().subscribe((res) => {
      this.arrEmpleados = res.sort();
    });

  }
  
  onSelectedOption(e) {
    
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dsqls.searchOption.length > 0)
      this.emp = this.dsqls.filteredListOptions();
    else {
      this.emp = this.dsqls.empData;
    }
    this.equipos = [];
    this.emp.forEach(el => {
      console.log(el);
      this.getTeamForName(el);
    });
  }

  getTeamForName(nom){
    this.dsqls.getTeams().subscribe((res) => {
      this.equipos = this.equipos.concat(res.filter(e => e.nombre === nom));
      console.log(this.equipos);
    }); 
  }

}