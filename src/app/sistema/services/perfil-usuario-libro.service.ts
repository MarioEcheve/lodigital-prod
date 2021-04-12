import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PerfilUsuarioLibro } from '../model/perfilUsuarioLibro';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioLibroService {

  url: string = `${environment.HOST}/perfilUsuarioLibro`;
  constructor(private http: HttpClient) { }

  public async ListaPerfilUsuarioLibro(){
    return await this.http.get<PerfilUsuarioLibro[]>(`${this.url}`).toPromise();
  }
}
