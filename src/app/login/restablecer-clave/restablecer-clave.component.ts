import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { LoginService } from '../../sistema/services/login.service';
import { UsuarioService } from '../../sistema/services/usuario.service';
import { TokenComponent } from '../activar-usuario/token/token.component';

@Component({
  selector: 'app-restablecer-clave',
  templateUrl: './restablecer-clave.component.html',
  styleUrls: [
    './restablecer-clave.scss',
    '../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../vendor/libs/spinkit/spinkit.scss',   
  ],
  encapsulation: ViewEncapsulation.None
})
export class RestablecerClaveComponent implements OnInit {
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


  reestablecerForm : FormGroup;
  token : string;
  tokenValido : boolean;
  constructor(private fb : FormBuilder , 
              private loginService : LoginService ,  
              private route: ActivatedRoute, 
              private router : Router,
              public toastrService: ToastrService,
              private appService: AppService) {
    this.inicializarFormReestablecer();
   }

  ngOnInit() {
    this.route.params.subscribe((params: Params ) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if(data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    });
  }
  inicializarFormReestablecer(){
    this.reestablecerForm = this.fb.group({
      codigo : ['' ,  Validators.required],
      password : ['',  Validators.required],
      confirmPassword : ['', Validators.required]
    },{
      validator: TokenComponent.passwordMatchValidator
    });
  }
  async reestablecerPassword(){
    this.blockPage();
    let body = {
      clave : this.reestablecerForm.controls['password'].value,
      claveProvisoria : this.reestablecerForm.controls['codigo'].value,
      token : this.token
    }
    let response = await this.loginService.restablecer(body);
    if(response === 1){
      this.unblockPageSucces();
    }else{
      this.unblockPageError();
    }
  }
  goLogin(){
    this.router.navigate(['login']);
  }
  blockPage() {
    this.blockUIPage.start();
  }
  unblockPageSucces(){
    setTimeout(() => {
      this.blockUIPage.stop();      
      this.showToast();          
      this.router.navigate(['/login']);
    }, 3000);
  }
  unblockPageError(){
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
      'Contraseña Actualizada Correctamente'
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
      'No se pudo Actualizar la contraseña'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }
}
