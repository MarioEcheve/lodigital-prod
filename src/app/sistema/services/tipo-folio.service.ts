import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TipoFolio } from '../model/tipoFolio';

@Injectable({
  providedIn: 'root'
})
export class TipoFolioService {
  url: string = `${environment.HOST}/tipoFolio`;
  constructor(private http: HttpClient) { }

  async  tipoFolio(){
    return await this.http.get<TipoFolio[]>(`${this.url}/listar`).toPromise();
  }
}
