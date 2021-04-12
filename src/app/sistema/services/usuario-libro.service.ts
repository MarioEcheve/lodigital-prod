import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioLibro } from '../model/usuarioLibro';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLibroService {

  url: string = `${environment.HOST}/usuarioLibro`;
  constructor(private http: HttpClient) { }

  public async crearUsuarioLibro(usuarioLibro : UsuarioLibro):Promise<UsuarioLibro>{
    return await this.http.post<UsuarioLibro>(`${this.url}/crearUsuarioLibro`,usuarioLibro).toPromise();
  }
  public async buscarUsuarioLibrosByLibro(idLibro : number){
    return await this.http.get<UsuarioLibro[]>(`${this.url}/buscarUsuarioLibrosByLibro/${idLibro}`).toPromise();
  }
  public async editarUsuarioLibro(usuarioLibro : UsuarioLibro):Promise<UsuarioLibro>{
    return await this.http.put<UsuarioLibro>(`${this.url}/actualizarUsuarioLibro`,usuarioLibro).toPromise();
  }
  public  async buscarUsuarioLibrosByLibroAndUsuario(idLibro : number,idUsuario : number){
    return await this.http.get<UsuarioLibro>(`${this.url}/buscarUsuarioLibrosByLibroAndUsuario/${idLibro}/${idUsuario}`).toPromise();
  }

  public  async buscarUsuarioLibrosByUsuario(idUsuario : number, idContrato : number){
    return await this.http.get<UsuarioLibro[]>(`${this.url}/buscarUsuarioLibrosByUsuario/${idUsuario}/${idContrato}`).toPromise();
  }
  public  async buscarMisLibros(idUsuario : number){
    return await this.http.get<UsuarioLibro[]>(`${this.url}/buscarMisLibros/${idUsuario}`).toPromise();
  }
}
