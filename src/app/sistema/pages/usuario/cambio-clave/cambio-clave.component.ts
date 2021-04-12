import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../app.service';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { EncryptService } from '../../../services/encrypt.service';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styles: [
    '',
    '../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../vendor/libs/spinkit/spinkit.scss',
  ],
  encapsulation: ViewEncapsulation.None

})
export class CambioClaveComponent implements OnInit {
  // Block Ui
  @BlockUI() blockUIPage: NgBlockUI;
  @BlockUI('element') blockUIElement: NgBlockUI;

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

  formCambioClave: FormGroup;
  empresaUsuarioRol: UsuarioEmpresa;
  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private encryptService: EncryptService,
    private router: Router,
    private loginService: LoginService,
    private appService: AppService,
    public toastrService: ToastrService,) {

    this.empresaUsuarioRol = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.inicializarForm();
  }

  ngOnInit() {
  }

  inicializarForm() {
    this.formCambioClave = this.fb.group({
      passActual: [''],
      password: [''],
      confirmPassword: ['']
    }, {
      validator: CambioClaveComponent.passwordMatchValidator
    })
  }
  async cambiarClave() {
    this.blockPage();
    let body = {
      rut: this.empresaUsuarioRol.usuario.rut,
      clave: this.formCambioClave.controls['passActual'].value,
      claveNueva: this.formCambioClave.controls['password'].value
    }
    let response = await this.usuarioService.cambiarClave(body);
    if (response === 1) {
      await this.unblockPage();
      await this.loginService.cerrarSesion(true);
    } else {
      await this.unblockPageError();
    }
  }
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
  blockPage() {
    this.blockUIPage.start();
  }
  async unblockPage() {
    setTimeout(() => {
      this.blockUIPage.stop();
      this.showToast();
      this.router.navigate(['login']);
    }, 3000);
  }

  async unblockPageError() {
    setTimeout(() => {
      this.blockUIPage.stop();
      this.showToastError();
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
      'Clave Cambiada Correctamente'
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
    this.type = 'error';

    this.toastrService[this.type](this.message || this.getMessageError(), this.title, options);
  }

  getMessageError() {
    const msgs = [
      'Error al cambiar la clave'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

}
