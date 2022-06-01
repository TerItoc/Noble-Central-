import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-supauser',
  templateUrl: './supauser.component.html',
  styleUrls: ['./supauser.component.css']
})
export class SUPAUSERComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  adminform= new FormGroup({
    Nombre: new FormControl(''),
    Correo: new FormControl('')
  });

  onSubmit(){
    console.warn(this.adminform.value);
  }



}
