import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.scss']
})
export class RedesSocialesComponent implements OnInit {

  form: FormGroup = this.fb.group({
    facebook: [ , [ Validators.maxLength(100) ] ],
    instagram: [ , [ Validators.maxLength(100) ] ],
    youtube: [ , [ Validators.maxLength(100) ] ],
    web: [ , [ Validators.maxLength(100) ] ],
    twitter: [ , [ Validators.maxLength(100) ] ],
    tiktok: [ , [ Validators.maxLength(100) ] ]
  });

  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void {
  }

  submit () {
    // console.log('Submit!');
  }

}
