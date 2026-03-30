// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // base_url: 'https://app.iecm.mx:3022/api',
    // protocol: 'https://',

    //Desarrollo
    // base_url: 'http://145.0.40.23:3021/api',
    // protocol: 'http://',
    
    //Local
    base_url: 'http://localhost:3021/api',
    protocol: 'http://',

    version: 'v1.0.0',
    convocatoria: './assets/download/CONVOCATORIA.pdf',
    aviso_privacidad: './assets/download/AVISO_DE_PRIVACIDAD_SIMPLIFICADO_CULTURA DEMOCRÁTICA.pdf'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
