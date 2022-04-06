import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-persona',
  templateUrl: './dropdown-persona.component.html',
  styleUrls: ['./dropdown-persona.component.css']
})
export class DropdownPersonaComponent implements OnInit {

  nombreEmpleado : string = "Cargando Nombre Empleado";
  evaluadores : [];

  constructor () {};

  ngOnInit(): void {

  }

}
