import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoFirma } from '../model/tipoFirna';

@Injectable({
  providedIn: 'root'
})
export class TipoFirmaService {

  url: string = `${environment.HOST}/tipoFirma`;
  constructor(private http: HttpClient) { }

  public async listar(){
    return await this.http.get<TipoFirma[]>(`${this.url}`).toPromise();
  }
}
