import { Component, OnInit, Input } from '@angular/core';
import { ProyectoHuerfano } from '../model/orphan.model';


@Component({
  selector: 'app-dropdown-huerfano',
  templateUrl: './dropdown-huerfano.component.html',
  styleUrls: ['./dropdown-huerfano.component.css']
})
export class DropdownHuerfanoComponent implements OnInit {

  @Input() nombreHuerfano : string;
  @Input() proyectos : ProyectoHuerfano[];
  @Input() id : number;

  constructor() { }

  ngOnInit(): void {

  }

}
