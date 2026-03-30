const getMenuFrontEnd = (perfil = 1, nombres = '') => {

    // console.log({perfil});

    const menu = [
        {
            label: '¡Hola ' + nombres + '!',
            items: [
                {
                    label: 'Inicio',
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['./inicio']
                },
                { label: 'Complementa tu información', icon: 'pi pi-fw pi-id-card', routerLink: ['./complementa-informacion'] }
            ]
        },
    ];

    return menu;
}

const getMenuAdminFrontEnd = (perfil = 1, nombre_usuario) => {

    // console.log({perfil});

    const menu = [
        {
            label: 'Bienvenido ' + nombre_usuario,
            items: [
                { label: 'Validación de registros', icon: 'pi pi-fw pi-check', routerLink: ['./validacion-de-registros'] }, // Módulo nuevo!!
                { label: 'Asistencias y Comités', icon: 'pi pi-fw pi-search', routerLink: ['./asistencias-y-comites'] },
                { label: 'Comité', icon: 'pi pi-fw pi-list', routerLink: ['./comites'] },
                { label: 'Reasignación de comité', icon: 'pi pi-fw pi-id-card', routerLink: ['./reasignacion-comite'] },
                { label: 'Sistema', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['./sistema'] },
                { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', routerLink: ['./reportes'] }
            ]
        },
    ];

    /* if (perfil === 1) {
        const sistematizacion = { label: 'Sistematización de Boletas', icon: 'pi pi-fw pi-users', routerLink: ['./sistematizacion-boleta'] };
        const captura_actas = { label: 'Captura de Actas', icon: 'pi pi-fw pi-file', routerLink: ['./captura-actas'] };
        menu.splice(1, 0, sistematizacion);
        menu.splice(1, 0, captura_actas);
    } else {
        const admin_boletas = { label: 'Gestionar Sistematización de Boletas', icon: 'pi pi-fw pi-user-edit', routerLink: ['./eliminar-captura-boleta'] };
        menu.splice(1, 0, admin_boletas);
    } */

    return menu;
}

module.exports = {
    getMenuFrontEnd,
    getMenuAdminFrontEnd
}