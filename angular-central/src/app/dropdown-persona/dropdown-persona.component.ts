import { Component, Input, OnInit } from '@angular/core';
import { Evaluacion } from '../model/equipos.model';

@Component({
  selector: 'app-dropdown-persona',
  templateUrl: './dropdown-persona.component.html',
  styleUrls: ['./dropdown-persona.component.css']
})

export class DropdownPersonaComponent implements OnInit {

  @Input() nombre : string;
  @Input() evaluadores : Evaluacion[];
  @Input() id : number;

  constructor () {
    
  };

  ngOnInit(): void {
    
  }

}
