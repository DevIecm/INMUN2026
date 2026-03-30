import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanLoad {

  constructor ( private adminService: AdminService,
    private router: Router ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.adminService.validarTokenAdmin()
      .pipe(tap((estaAutenticado: boolean) => {
        // Efecto secundario
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login-admin');
        }
      }))
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> {
    return this.adminService.validarTokenAdmin()
      .pipe(tap((estaAutenticado: boolean) => {
        // Efecto secundario
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login-admin');
        }
      }))
  }
}
