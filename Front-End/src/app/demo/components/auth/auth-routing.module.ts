import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { FormRecuperarContrasenaComponent } from './form-recuperar-contrasena/form-recuperar-contrasena.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'login/:correo_electronico/:token_mail/:uuid', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
        { path: 'olvide-contrasena', component: RecuperarContrasenaComponent},
        { path: 'recuperar-contrasena/:token_mail/:usuario', component: FormRecuperarContrasenaComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
