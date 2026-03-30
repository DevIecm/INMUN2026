import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class AlcaldiasService {

  constructor( private http: HttpClient) { }


  obtenerAlcaldias() {
    const url = `${base_url}/alcaldias`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.alcaldiaDB)
      )


  }
}
