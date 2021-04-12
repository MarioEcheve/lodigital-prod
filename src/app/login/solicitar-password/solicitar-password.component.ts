import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { LoginService } from '../../sistema/services/login.service';
import { UsuarioService } from '../../sistema/services/usuario.service';
import { RutUtil } from '../../sistema/util/rut-util';
import { rutEsValido } from '../../sistema/util/validar-rut';

@Component({
  selector: 'app-solicitar-password',
  templateUrl: './solicitar-password.component.html',
  styleUrls: ['./solicitar-password.scss']
})
export class SolicitarPasswordComponent implements OnInit {
  @BlockUI() blockUIPage: NgBlockUI;
  @BlockUI('element') blockUIElement: NgBlockUI;
  formSolicitarPassword : FormGroup;
  rutValido : Boolean;
  emailsUsuario : any = [];

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


  constructor(private router : Router, 
              private loginService : LoginService,
              private fb : FormBuilder,
              public toastrService: ToastrService,
              private appService: AppService,
              private usuarioService : UsuarioService ) {
    this.inicializar();
   }

  ngOnInit() {
    this.formSolicitarPassword.controls['rut'].valueChanges.subscribe(rut=>{
      this.validarRut(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRut(rut);
    });
  }

  inicializar(){
    this.formSolicitarPassword = this.fb.group({
      rut : [""],
      correo :[""]
    });
  }

  solicitarPassword(){
    this.blockPage();
    let body = {
      rut : RutUtil.rutSinPuntosConGuion(this.formSolicitarPassword.controls['rut'].value),
      correo : this.formSolicitarPassword.controls['correo'].value
    }
    this.loginService.enviarCorreoReestablecerContraseña(body).subscribe(
      response=>{
        if(response === 1){
          this.unblockPage();
        }else{
          this.unblockPageError();
        }
      }
    )
  }
  cancelar(){
    this.router.navigate(['/login']);

  }
  validarRut(rut){
    this.rutValido = rutEsValido(rut);
    if(this.rutValido){
      this.buscarUsuarioByRut(rut);
    }else{
      this.emailsUsuario = [];
    }
  }
  validaUsuarioBlurf(){
    if(this.rutValido){
    }else{
      this.formSolicitarPassword.controls['rut'].setValue('');
    }
  }
  private verificaRut(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.formSolicitarPassword.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    }else{
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.formSolicitarPassword.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        }else {
          this.formSolicitarPassword.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      }else {
        this.formSolicitarPassword.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }
  blockPage() {
    this.blockUIPage.start();
  }
  unblockPage(){
    setTimeout(() => {
      this.blockUIPage.stop();                
      this.showToast();
      this.router.navigate(['/login']);
    }, 3000);
  }

  unblockPageError(){
    setTimeout(() => {
      this.blockUIPage.stop();                
      this.showToast();
    }, 3000);
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

  getMessage() {
    const msgs = [
      'Correo enviado'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
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
    this.type = 'success';

    this.toastrService[this.type](this.message || this.getMessage(), this.title, options);
  }

  getMessageError() {
    const msgs = [
      'Correo no enviado'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }
  async buscarUsuarioByRut(rut : string){
    let usuario = await this.usuarioService.usuarioByRut(rut.toUpperCase());
    let { emailPrincipal } = usuario;
    let { emailSecundario } = usuario;
    this.emailsUsuario = [...this.emailsUsuario,emailPrincipal,emailSecundario];
  }
}
