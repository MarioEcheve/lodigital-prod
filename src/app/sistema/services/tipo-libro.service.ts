import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EstadoLibro } from '../model/estadoLibro';

@Injectable({
  providedIn: 'root'
})
export class TipoLibroService {

  url: string = `${environment.HOST}/tipoLibro`;
  constructor(private http: HttpClient) { }

  public async listar (){
    return await this.http.get<EstadoLibro[]>(`${this.url}`).toPromise();
  }
}
