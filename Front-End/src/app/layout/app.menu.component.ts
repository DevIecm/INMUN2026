import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { UsuarioService } from '../services/usuario.service';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, public router: Router, private usuarioService: UsuarioService, private menuService: MenuService) { }

    ngOnInit() {
        /* this.model = [
            {
                label: 'Aqui',
                items: this.menuService.cargarMenu()
            }
        ]; */
        this.model = this.menuService.cargarMenu();
        // console.log(this.menuService.cargarMenu());
        
        /* this.model = [
            {
                label: 'Usuario - $user',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['./inicio'] },
                    { label: 'Complementa tu información', icon: 'pi pi-fw pi-id-card', routerLink: ['./complementa-informacion'] },
                    // { label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logOut() },
                ]
            },
            {
                label: 'Administración',
                items: [
                    // { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['./'] },
                    { label: 'Validación', icon: 'pi pi-fw pi-search', routerLink: ['./validacion'] },
                    { label: 'Comité', icon: 'pi pi-fw pi-list', routerLink: ['./comites'] },
                    { label: 'Reasignación de comité', icon: 'pi pi-fw pi-id-card', routerLink: ['./reasignacion-comite'] },
                    { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', routerLink: ['./reportes'] }
                ]
            }
        ]; */
    }
}
