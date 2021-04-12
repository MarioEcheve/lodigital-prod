import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../sistema/services/login.service';
import { AppService } from '../../app.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from './../../../environments/environment';
import { UsuarioEmpresaService } from '../../sistema/services/usuario-empresa.service';
import { EmpresaService } from '../../sistema/services/empresa.service';
import { EncryptService } from '../../sistema/services/encrypt.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { rutEsValido } from '../../sistema/util/validar-rut';
import { isNumber } from '../../sistema/util/validar-rut';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutUtil } from '../../sistema/util/rut-util'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [    
    '../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../vendor/libs/spinkit/spinkit.scss',    
    './login.scss'
  ],
  encapsulation: ViewEncapsulation.None

})
export class LoginComponent implements OnInit {
  // Block Ui
  @BlockUI() blockUIPage: NgBlockUI;
  @BlockUI('element') blockUIElement: NgBlockUI;
  @ViewChild('rut')rut: ElementRef;

  elementBlocked = false;
  formLogin : FormGroup;
  rutValido : Boolean;

  title = '';
  message = '';
  type = 'success';
  tapToDismiss = true;
  closeButton = false;
  progressBar = false;
  preventDuplicates = false;
  newestOnTop = false;
  progressAnimation = 'decreasing';
  positionClass = 'toast-top-right';
  curMsgIndex = -1;

  constructor(private appService: AppService, 
              private router : Router, 
              private loginService: LoginService,
              private usuarioEmpresaService : UsuarioEmpresaService,
              private empresaService : EmpresaService,
              private encryptService : EncryptService,
              public toastrService: ToastrService,
              public fb : FormBuilder) {
    this.appService.pageTitle = 'Login v1 - Pages';
    this.formLogin = this.fb.group({
      rut : [''] ,
      password : []
    })
  }
  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };
  ngOnInit(){
    this.formLogin.controls['rut'].valueChanges.subscribe(rut=>{
      this.validarRut(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRut(rut);
    });
  }
  login() {
    let rut = this.formLogin.controls['rut'].value;
    let password = this.formLogin.controls['password'].value;
    rut = RutUtil.rutSinPuntosConGuion(rut);
    rut = rut.toUpperCase();
    console.log(rut)
    this.loginService.login(rut,password).subscribe(
      data=>{
        this.blockPage();
        const helper = new JwtHelperService();
        sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
        let decodedToken = helper.decodeToken(data.access_token);
        // buscamos el usuario por username 
        this.empresaService.obtenerUsuarioByRut(rut).subscribe(
          response=>{
            this.usuarioEmpresaService.obtenerEmpresasUsuario(response.idUsuario).subscribe(
              (empresasUsuario : any)=>{
                localStorage.clear();
                this.unblockPage();
                let objectEncryptEmpresas = this.encryptService.encrypt(JSON.stringify(empresasUsuario));
                let objectEncryptEmpresaAcual = this.encryptService.encrypt(JSON.stringify(empresasUsuario[0].empresa));
                let objectEncryptEmpresaUsuarioRol = this.encryptService.encrypt(JSON.stringify(empresasUsuario[0]));
                localStorage.setItem("empresas", objectEncryptEmpresas);
                localStorage.setItem("empresaActual", objectEncryptEmpresaAcual);
                localStorage.setItem("empresaUsuarioRol", objectEncryptEmpresaUsuarioRol);
              }
            );
          }
        );
      },error=>{
        this.showToastError();
      }
    );
  }
  showToast() {
    const options = {
      tapToDismiss: this.tapToDismiss,
      closeButton: this.closeButton,
      progressBar: this.progressBar,
      progressAnimation: this.progressAnimation,
      positionClass: this.positionClass,
      rtl: this.appService.isRTL
    }
    this.toastrService.toastrConfig.newestOnTop = this.newestOnTop;
    this.toastrService.toastrConfig.preventDuplicates = this.preventDuplicates;
    this.type = 'success';

    this.toastrService[this.type](this.message || this.getMessage(), this.title, options);
  }

  showToastError() {
    const options = {
      tapToDismiss: this.tapToDismiss,
      closeButton: this.closeButton,
      progressBar: this.progressBar,
      progressAnimation: this.progressAnimation,
      positionClass: this.positionClass,
      rtl: this.appService.isRTL
    }
    this.toastrService.toastrConfig.newestOnTop = this.newestOnTop;
    this.toastrService.toastrConfig.preventDuplicates = this.preventDuplicates;
    this.type = 'error';
    this.toastrService[this.type](this.message || this.getMessageError(), this.title, options);
  }

  getMessage() {
    const msgs = [
      'Usuario Logeado'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }
  getMessageError() {
    const msgs = [
      'Usuario o Contraseña incorrectos'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }
  blockPage() {
    this.blockUIPage.start();
  }
  unblockPage(){
    setTimeout(() => {
      this.blockUIPage.stop();                
      this.router.navigate(['dashboards/dashboard-1']);
      this.showToast();
    }, 3000);
  }
  toggleElementBlocking() {
    this.elementBlocked = !this.elementBlocked;

    if (this.elementBlocked) {
      this.blockUIElement.start();
    } else {
      this.blockUIElement.stop();
    }
  }
  restablecerClave(){
    // ejecuta servicio
    this.router.navigate(['/login/solicitar-contraseña']);
  }
  
  validarRut(rut){
    this.rutValido = rutEsValido(rut);
    
  }
  validaUsuarioBlurf(){
    if(this.rutValido){
    }else{
      this.formLogin.controls['rut'].setValue('');
    }
  }
  private verificaRut(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.formLogin.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    }else{
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.formLogin.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        }else {
          this.formLogin.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      }else {
        this.formLogin.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }
}
