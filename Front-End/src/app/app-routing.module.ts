import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'auth',
                pathMatch: 'full'
            },
            {
                path: 'main', component: AppLayoutComponent,
                children: [
                    // { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
                    { path: 'inicio', loadChildren: () => import('./demo/components/inicio/inicio.module').then(m => m.InicioModule) },
                    { path: 'documentos', loadChildren: () => import('./demo/components/documentos/documentos.module').then(m => m.DocumentosModule) },
                    { path: 'datos-personales', loadChildren: () => import('./demo/components/datos-personales/datos-personales.module').then(m => m.DatosPersonalesModule) },
                    { path: 'datos-contacto', loadChildren: () => import('./demo/components/datos-contacto/datos-contacto.module').then(m => m.DatosContactoModule) },
                    { path: 'redes-sociales', loadChildren: () => import('./demo/components/redes-sociales/redes-sociales.module').then(m => m.RedesSocialesModule) },
                    { path: 'domicilio-residencia', loadChildren: () => import('./demo/components/domicilio-residencia/domicilio-residencia.module').then(m => m.DomicilioResidenciaModule) },
                    { path: 'asociacion-civil', loadChildren: () => import('./demo/components/asociacion-civil/asociacion-civil.module').then(m => m.AsociacionCivilModule) },
                    { path: 'complementa-informacion', loadChildren: () => import('./demo/components/steps/steps.module').then(m => m.StepsModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ],
                canActivate: [AuthGuard],
                canLoad: [AuthGuard]
            },
            {
                path: 'admin', component: AppLayoutComponent,
                loadChildren: () => import('./admin-profile/admin-profile.module').then(m => m.AdminProfileModule),
                canActivate: [AdminAuthGuard],
                canLoad: [AdminAuthGuard]
            },
            {
                path: 'login-admin',
                component: LoginComponent
                // loadChildren: () => import('./admin-profile/admin-profile.module').then(m => m.AdminProfileModule)
            },

            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload', useHash: true })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
