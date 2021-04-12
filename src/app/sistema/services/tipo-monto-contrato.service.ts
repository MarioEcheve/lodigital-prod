import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoMontoContrato } from '../model/tipoMontoContrato';

@Injectable({
  providedIn: 'root'
})
export class TipoMontoContratoService {

  url: string = `${environment.HOST}/tipoMontoContrato`;
  constructor(private http: HttpClient) { }

  public async listar(){
    return await this.http.get<TipoMontoContrato[]>(`${this.url}`).toPromise();
  }
}
