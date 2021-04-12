import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Libro } from '../model/Libro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  url: string = `${environment.HOST}/libro`;
  constructor(private http: HttpClient) { }

  public async librosByContrato(idContrato : number){
    return await this.http.get<Libro[]>(`${this.url}/libroByContrato/${idContrato}`).toPromise();
  }
  async save(libro : Libro) : Promise<Libro>{
    return await this.http.post<Libro>(`${this.url}/crearLibro`, libro).toPromise();
  }
  async libroById(idLibro : number){
    return await this.http.get<Libro>(`${this.url}/libroById/${idLibro}`).toPromise();
  }
  public async libroByUsuarioLibro(idUsuario : number){
    return await this.http.get<Libro[]>(`${this.url}/libroByContrato/${idUsuario}`).toPromise();
  }
  
}
