import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EstadoUsuario } from '../model/estadoUsuario';

@Injectable({
  providedIn: 'root'
})
export class EstadoUsuarioService {

  url: string = `${environment.HOST}/estadoUsuario`;
  constructor(private http: HttpClient) { }

  public estadosUsuario(){
    return this.http.get<EstadoUsuario[]>(`${this.url}`);
  }
}
