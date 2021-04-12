import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoValorContrato } from '../model/tipoValorContrato';

@Injectable({
  providedIn: 'root'
})
export class TipoValorContratoService {

  url: string = `${environment.HOST}/tipoValorContrato`;
  constructor(private http: HttpClient) { }

  public async listar(){
    return await this.http.get<TipoValorContrato[]>(`${this.url}`).toPromise();
  }
}
