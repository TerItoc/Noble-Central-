import { Component, Input, OnInit } from '@angular/core';
import { Evaluacion } from '../model/equipos.model';
import { DashboardSqlService } from '../dashboard-sql.service';

@Component({
  selector: 'app-dropdown-persona',
  templateUrl: './dropdown-persona.component.html',
  styleUrls: ['./dropdown-persona.component.css']
})

export class DropdownPersonaComponent implements OnInit {

  @Input() nombre : string;
  @Input() evaluadores : Evaluacion[];
  @Input() id : number;

  constructor (private dsqls : DashboardSqlService) {
    
  };

  ngOnInit(): void {
    
  }

  refresh(): void {
    window.location.reload();
  }

  delEval(empA,relacion,empB): void {
    console.log(empA,relacion,empB);
    this.dsqls.delEval(empA,relacion,empB).subscribe((res) => {this.refresh()});
  }

  areYouSure(): void {
    //popup here
  }

}
