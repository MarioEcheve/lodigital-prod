import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoModalidad } from '../model/tipoModalidad';

@Injectable({
  providedIn: 'root'
})
export class TipoModalidadService {
  url: string = `${environment.HOST}/tipoModalidad`;
  constructor(private http: HttpClient) { }

  public async tiposDeModalidad(){
    return await this.http.get<TipoModalidad[]>(this.url).toPromise();
  }
}
