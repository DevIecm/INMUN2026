import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styles: [
  ]
})
export class StepsComponent implements OnInit {

  index: number = 0;
  tab2Dis: boolean = true;
  tab3Dis: boolean = true;
  estado: number = 0;
  
  constructor( private usuarioService:UsuarioService ) { }
  
  ngOnInit(): void {
    this.cargaEstado()
  }


  cargaEstado(){
    const { telefono_casa, telefono_celular, id_comite, estado } = this.usuarioService.usuario;
    this.estado = estado;

    // console.log({telefono_casa, telefono_celular, id_comite, estado});
    

    if(telefono_casa && telefono_celular){
      this.tab2Dis = false;
    }
    
    if(id_comite){
      this.tab3Dis = false;
      this.tab2Dis = false;
    }
  }
  
  cierraVideoMetodo(elemento: any, index: number) {
    this.index = index;
    if(index == 1 || index == 2){
      this.tab2Dis = false;
    }

    if(index == 2){
      this.tab3Dis = false
    }
    // alert('Aqui!')
  }

}
