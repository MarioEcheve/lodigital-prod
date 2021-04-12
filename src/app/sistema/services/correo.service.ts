import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  url: string = `${environment.HOST}/login`;
  constructor(private http: HttpClient) { }

  public activarUsuarioEmpresa(body : any){
    return this.http.post<any>(`${this.url}/enviarCorreoActivarUsuario`, body).toPromise();
  }

}
