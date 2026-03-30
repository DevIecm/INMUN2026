import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image'; 
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ScrollTopModule } from 'primeng/scrolltop';
import {DividerModule} from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import {ToastModule} from 'primeng/toast';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TabViewModule} from 'primeng/tabview';
import {InplaceModule} from 'primeng/inplace';

import {BlockUIModule} from 'primeng/blockui';
import {AnimateModule} from 'primeng/animate';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {RatingModule} from 'primeng/rating';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SelectButtonModule} from 'primeng/selectbutton';




import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ImageModule,
    DropdownModule
  ], exports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ImageModule,
    DropdownModule,
    InputMaskModule,
    MenuModule,
    ProgressBarModule,
    CalendarModule,
    InputNumberModule,
    RadioButtonModule,
    FileUploadModule,
    KeyFilterModule,
    ScrollTopModule,
    DividerModule,
    TagModule,
    HttpClientModule,
    ToastModule,
    PanelMenuModule,
    TabViewModule,
    InplaceModule,
    BlockUIModule,
    AnimateModule,
    ConfirmDialogModule,
    ToolbarModule,
    TableModule,
    RatingModule,
    DialogModule,
    CardModule,
    BadgeModule,
    ProgressSpinnerModule,
    SelectButtonModule
  ]
})
export class PrimeNgModule { }
