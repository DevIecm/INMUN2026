import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.scss']
})
export class DatosContactoComponent implements OnInit {

  formPosted: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  estado ( event: boolean ) {
    this.formPosted = event;
  }



}
