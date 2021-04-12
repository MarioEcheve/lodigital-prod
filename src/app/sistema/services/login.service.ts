import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string = `${environment.HOST}/oauth/token`;
  userActivity;
  userInactive: Subject<any> = new Subject();
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  login(usuario: string, contrasena: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });  
  }
  async cerrarSesion(goLogin? : Boolean) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    await this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
      sessionStorage.clear();
      localStorage.clear();
      if(!goLogin){
        this.router.navigate(['login']);
      }
    });
  }
  estaLogeado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  enviarCorreo(correo: string) {
    return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }
  enviarCorreoReestablecerContraseña(body: any) {
    return  this.http.post<number>(`${environment.HOST}/login/enviarCorreoReestablecerPassword`, body);
  }

  verificarTokenReset(token: string) {  
    return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
  }

  async restablecer (body: any ) {
    return await this.http.post<number>(`${environment.HOST}/login/restablecer`, body).toPromise();
  }
}
