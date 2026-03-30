import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {

  @Input() icon!: string;
  @Input() link!: string;
  @Input() documentName!: string;
    
  @ViewChild('icon') icono?: ElementRef;

  constructor() { }

  ngOnInit(): void {
    setTimeout( () => {
      // this.icono?.nativeElement.classList.add('pi-file-pdf');
      this.icono?.nativeElement.classList.add(this.icon);
    }, 500 );
    
  }

    

}
