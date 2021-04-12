import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EstadoUsuarioLibro } from '../model/estadoUsuarioLibro';

@Injectable({
  providedIn: 'root'
})
export class EstadoUsuarioLibroService {

  url: string = `${environment.HOST}/estadoUsuarioLibro`;
  constructor(private http: HttpClient) { }

  public async ListaEstadoUsuarioLibro(){
    return await this.http.get<EstadoUsuarioLibro[]>(`${this.url}`).toPromise();
  }
}
