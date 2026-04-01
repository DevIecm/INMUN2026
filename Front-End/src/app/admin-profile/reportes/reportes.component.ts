import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { environment } from 'src/environments/environment';

const protocol = environment.protocol;

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styles: [
        `
    .card-rpt:hover {
      cursor: pointer;
    }
    `
    ]
})
export class ReportesComponent implements OnInit {

    constructor(private reportesService: ReportesService) { }

    ngOnInit(): void {
    }

    descargar_reporte(nombre_reporte: string) {
        // console.log(nombre_reporte);

        switch (nombre_reporte) {
            case 'registro_usuario':
                this.reportesService.rptRegistroUsuarios()
                    .subscribe((res: any) => {
                        window.open(`${protocol}${res.reporte}`, '_parent', 'download');

                    })
                break;

            case 'justificantes':
                this.reportesService.zipJustificantes()
                    .subscribe((blob: any) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'justificantes.zip'; // Nombre del archivo
                        a.click();
                        window.URL.revokeObjectURL(url); // Liberar memoria
                    }, (error) => {
                        console.error('Error al descargar el archivo:', error);
                    })
                break;
            default:
                break;
        }

    }

}
