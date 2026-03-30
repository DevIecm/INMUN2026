import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { environment } from '../../environments/environment.prod';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {

    version: string = environment.version;

    constructor(public layoutService: LayoutService) { }
}
