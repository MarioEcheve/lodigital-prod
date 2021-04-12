import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioEmpresaDTO } from '../DTO/usuarioEmpresaDTO';
import { UsuarioEmpresa } from '../model/usuario-empresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEmpresaService {
  url: string = `${environment.HOST}/usuarioEmpresa`;
  constructor(private http: HttpClient) { 

  }
  public  obtenerEmpresasUsuario(idUsuario : number){
    return  this.http.get<UsuarioEmpresa>(`${this.url}/${idUsuario}`);
  }
  public async usuariosEmpresasByCompany(idEmpresa : number){
    return await this.http.get<UsuarioEmpresa[]>(`${this.url}/usuariosEmpresasByCompany/${idEmpresa}`).toPromise();
  }
  public async crearUsuarioEmpresa(usuarioEmpresa : UsuarioEmpresa):Promise<UsuarioEmpresa>{
    return await this.http.post<UsuarioEmpresa>(`${this.url}/crearUsuarioEmpresa`,usuarioEmpresa).toPromise();
  }
  public async buscarUsuarioEmpresaByUsuarioAndEmpresa(idEmpresa : number, idUsuario : number):Promise<any>{
    return await this.http.get<UsuarioEmpresa>(`${this.url}/usuariosEmpresasByCompanyAndUser/${idEmpresa}/${idUsuario}`).toPromise();
  }
  public async actualizarUsuarioEmpresa(usuarioEmpresa : UsuarioEmpresaDTO):Promise<UsuarioEmpresaDTO>{
    return await this.http.put<UsuarioEmpresaDTO>(`${this.url}/crearUsuarioEmpresa`,usuarioEmpresa).toPromise();
  }
  public async actualizarUsuarioEmpresaEditarUsuario(usuarioEmpresa : UsuarioEmpresa):Promise<UsuarioEmpresa>{
    return await this.http.put<UsuarioEmpresa>(`${this.url}/actualizarUsuarioEmpresaEditarUsuario`,usuarioEmpresa).toPromise();
  }
 
}
