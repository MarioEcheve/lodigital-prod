import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../sistema/services/login.service';
import { AppService } from '../../app.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from './../../../environments/environment';
import { UsuarioEmpresaService } from '../../sistema/services/usuario-empresa.service';
import { EmpresaService } from '../../sistema/services/empresa.service';
import { EncryptService } from '../../sistema/services/encrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../../vendor/styles/pages/authentication.scss'
  ]
})
export class LoginComponent implements OnInit {
  constructor(private appService: AppService, 
              private router : Router, 
              private loginService: LoginService,
              private usuarioEmpresaService : UsuarioEmpresaService,
              private empresaService : EmpresaService,
              private encryptService : EncryptService) {
    this.appService.pageTitle = 'Login v1 - Pages';
  }
  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };
  ngOnInit(){}
  login() {
    this.loginService.login(this.credentials.email,this.credentials.password).subscribe(
      data=>{
        const helper = new JwtHelperService();
        sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
        let decodedToken = helper.decodeToken(data.access_token);
        // buscamos el usuario por username 
        this.empresaService.obtenerUsuarioByRut(this.credentials.email).subscribe(
          response=>{
            this.usuarioEmpresaService.obtenerEmpresasUsuario(response.idUsuario).subscribe(
              (empresasUsuario : any)=>{
                localStorage.clear();
                let objectEncryptEmpresas = this.encryptService.encrypt(JSON.stringify(empresasUsuario));
                let objectEncryptEmpresaAcual = this.encryptService.encrypt(JSON.stringify(empresasUsuario[0]));
                localStorage.setItem("empresas", objectEncryptEmpresas);
                localStorage.setItem("empresaActual", objectEncryptEmpresaAcual);
                this.router.navigate(['dashboards/dashboard-1']);
              }
            );
          }
        );
      },error=>{
        console.log(error);
      }
    );
  }
}
