import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoContrato } from '../model/TipoContrato';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {
  url: string = `${environment.HOST}/tipoContrato`;
  constructor(private http: HttpClient) { }

  public async tiposDeContratos(){
    return await this.http.get<TipoContrato[]>(this.url).toPromise();
  }
}
