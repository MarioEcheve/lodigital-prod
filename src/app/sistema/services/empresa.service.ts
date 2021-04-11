import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Empresa } from '../model/empresa';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  url: string = `${environment.HOST}/empresa`;
  constructor(private http: HttpClient) { 

  }
  public obtenerUsuarioByRut(rut : String){
    return this.http.get<Usuario>(`${this.url}/usuarioByRut/${rut}`);
  }
}
