import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    public menu: any[] = [];

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    constructor( private usuarioService: UsuarioService ){}

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    cargarMenu(){
        this.menu = JSON.parse(localStorage.getItem('menu') || '') || [];
        // console.log(this.menu);
        const items = this.menu[0].items;
        // console.log(items);
        this.menu[0].items.push({ label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => { this.logOut() } });
        // items.push({ label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => { this.logOut() } })
        return this.menu;
        
    }

    logOut(){
        this.usuarioService.logOut();
    }
}
