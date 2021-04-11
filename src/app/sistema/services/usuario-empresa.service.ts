import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioEmpresa } from '../model/usuario-empresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEmpresaService {
  url: string = `${environment.HOST}/usuarioEmpresa`;
  constructor(private http: HttpClient) { 

  }
  public obtenerEmpresasUsuario(idUsuario : number){
    return this.http.get<UsuarioEmpresa>(`${this.url}/${idUsuario}`);
  }
}
