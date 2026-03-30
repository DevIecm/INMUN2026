import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-avance-registro',
  templateUrl: './avance-registro.component.html',
  styleUrls: ['./avance-registro.component.scss']
})
export class AvanceRegistroComponent implements OnInit {

  public txt_datos_personales: string = 'text-red-500';
  public bg_datos_personales: string = 'bg-red-100';
  public icon_datos_personales: string = 'pi-times';

  public txt_seleccion_comite: string = 'text-red-500';
  public bg_seleccion_comite: string = 'bg-red-100';
  public icon_seleccion_comite: string = 'pi-times';

  public txt_permisos_autorizaciones: string = 'text-red-500';
  public bg_permisos_autorizaciones: string = 'bg-red-100';
  public icon_permisos_autorizaciones: string = 'pi-times';

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obteneravanceRegistro();
  }

  obteneravanceRegistro() {

    this.usuarioService.obteneravanceRegistro()
      .subscribe((res: any) => {

        console.log(res);
        const { estado, id_usuario } = res.avanceRegistroDB;
        // estado = 2 > Complementa información
        // estado = 3 > Selecciona comité
        // estado = 4 > Permisos y autorizaciones

        // console.log({estado, id_usuario});
        if (estado === 2) {
          // Complementó informacion
          this.datosPersonalesCheck();
        }
        
        if(estado === 3){
          this.datosPersonalesCheck();
          this.seleccionComiteCheck();
        }

        if(estado === 4 || estado === 5){
          this.datosPersonalesCheck();
          this.seleccionComiteCheck();
          this.permisosYAutorizacionesCheck();
        }


      }, (err: Error) => {
        console.log(err);

      })

    // text-green-500
    // text-red-500
    // pi-check

  }

  datosPersonalesCheck() {
    this.txt_datos_personales = 'text-green-500';
    this.bg_datos_personales = 'bg-green-100';
    this.icon_datos_personales = 'pi-check';
  }
  
  seleccionComiteCheck() {
    this.txt_seleccion_comite = 'text-green-500';
    this.bg_seleccion_comite = 'bg-green-100';
    this.icon_seleccion_comite = 'pi-check';
  }

  permisosYAutorizacionesCheck(){
    this.txt_permisos_autorizaciones = 'text-green-500';
    this.bg_permisos_autorizaciones = 'bg-green-100';
    this.icon_permisos_autorizaciones = 'pi-check';
  }

}
