import { Component, OnInit } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Empleado } from '../model/empleado.model'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  emp: Empleado[]
  emps : any;
  constructor(
    private dsqls: DashboardSqlService
  ) { }

  ngOnInit() {
    this.dsqls.getEmps().subscribe(empleados => {
      this.emp = empleados
      this.dsqls.empData = empleados
    });
  }
  
  onSelectedOption(e) {
    console.log(e);
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dsqls.searchOption.length > 0)
      this.emp = this.dsqls.filteredListOptions();
    else {
      this.emp = this.dsqls.empData;
    }

    console.log(this.emp)
  }

}