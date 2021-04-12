import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioDTO } from '../DTO/usuarioDTO';
import { Usuario } from '../model/usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = `${environment.HOST}/usuario`;
  constructor(private http: HttpClient) { }

  public async actualizarActivarUsuario(usuario : Usuario){
    return await this.http.put<Usuario>(`${this.url}/modificarActivarUsuario`,usuario).toPromise();
  }
  public async actualizarUsuario(usuarioDTO : UsuarioDTO){
    return await this.http.put<number>(`${this.url}/updateUsuario`,usuarioDTO).toPromise();
  }
  public async usuarioByRut(rut : string){
    return await this.http.get<Usuario>(`${this.url}/usuarioByRut/${rut}`).toPromise();
  }
  public async crearUsuario(usuario : Usuario):Promise<Usuario>{
    return await this.http.post<Usuario>(`${this.url}/crearUsuario`,usuario).toPromise();
  }
  public async cambiarClave(body : any){
    try {
      return await this.http.post<any>(`${this.url}/cambiarClave`, body).toPromise();
    } catch (error) {
      return 0;
    }
  }
  public async  findById(idUsuario : number){
    return  await this.http.get<Usuario>(`${this.url}/findById/${idUsuario}`).toPromise();
  }
}
