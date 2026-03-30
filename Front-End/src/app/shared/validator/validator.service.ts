import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public regexElector: string = "^[a-zA-Z]{6}[0-9]{8}((h|H)|(m|M))[0-9]{3}$";
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public regexPDF: string = "^([a-zA-Z]|[0-9])+\\.(pdf|PDF)$";
  public regexIMG: string = "^([a-zA-Z]|[0-9])+\\.((png|PNG)|(jpg|JPG))$";
  public regexString: string = "(?!\\s*$)^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\s]*$";
  public regexApellidoPaterno = "^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+\\s?|[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+$";
  public regexApellidoMaterno: string = "^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]*\\s*|[a-zA-ZÀ-ÿ\\u00f1\\u00d1]*$";
  public regexTelefono: string = "^(?!55-5483-3800)[0-9]{2}[-]{1}[0-9]{4}[-]{1}[0-9]{4}$"
  // public regexNombres: string = "^[a-zA-Z0-9]+\s?[a-zA-Z0-9]*$^[a-zA-Z]*\\s?[a-zA-Z]*";
  public regexAlphanum: string = "^[a-zA-Z0-9]+[a-zA-Z0-9\\.\\s]*$";
  public regexCircunscripcion: string = "^([0]{1}[1-9]{1}|[1]{1}[0-1]{1})$";
  public regexMeses: string = "^([0]{1}[1-9]{1}|[1]{1}[0-1]{1})$";



  public regexString_KF: RegExp = /(?![0-9])[a-zA-ZÀ-ÿ\\u00f1\\u00d1\s]/;
  public regexEmail_KF: RegExp = /[a-zA-ZÀ-ÿ\\u00f1\\u00d1@\.0-9]/;
  public regexNumDir_KF: RegExp = /[a-zA-ZÀ-ÿ\\u00f1\\u00d1\s\.0-9]/;


  constructor() { }

  camposIguales( campo1: string, campo2: string ) {
    return ( formGroup: AbstractControl ): ValidationErrors | null => {
      // console.log(formGroup.controls['nombre'].value);
    
      const valueCampo1 = formGroup.get( campo1 )?.value;
      const valueCampo2 = formGroup.get( campo2 )?.value;

      if (valueCampo1 !== valueCampo2) {
        formGroup.get( campo2 )?.setErrors({ noIguales: true });
        return { noIguales: true };
      }

      formGroup.get( campo2 )?.setErrors( null );
        
      return null;
    }
  }

  compararTelefonos( campo1: string, campo2: string, campo3: string  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const phone1 = formGroup.get(campo1)?.value;
      const phone2 = formGroup.get(campo2)?.value;
      const phone3 = formGroup.get(campo3)?.value;

      if ( phone1 == phone2 || phone2 == phone3 ) {
        // console.log(formGroup.get(campo3)?.errors);
        formGroup.get(campo3)?.setErrors({ iguales: true });
        return { iguales: true };

      } else if ( phone2 == phone3 ) {
        // console.log(formGroup.get(campo3)?.errors);
        formGroup.get(campo3)?.setErrors({ iguales: true });
        return { iguales: true };

      } else if ( phone1 == phone3 ) {
        // console.log(formGroup.get(campo3)?.errors);
        formGroup.get(campo3)?.setErrors({ iguales: true });
        return { iguales: true };
        
      } 

      // formGroup.get(campo3)?.setErrors({ iguales: null });
      formGroup.get(campo3)?.setErrors(null);
      formGroup.get(campo3)?.updateValueAndValidity();

      return null;


    };
  }

}
