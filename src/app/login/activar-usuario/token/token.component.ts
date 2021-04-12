import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../app.service';
import { UsuarioEmpresaDTO } from '../../../sistema/DTO/usuarioEmpresaDTO';
import { EstadoUsuario } from '../../../sistema/model/estadoUsuario';
import { UsuarioEmpresa } from '../../../sistema/model/usuario-empresa';
import { EstadoUsuarioService } from '../../../sistema/services/estado-usuario.service';
import { LoginService } from '../../../sistema/services/login.service';
import { UsuarioEmpresaService } from '../../../sistema/services/usuario-empresa.service';
import { UsuarioService } from '../../../sistema/services/usuario.service';
import { RutUtil } from '../../../sistema/util/rut-util';
import { rutEsValido } from '../../../sistema/util/validar-rut';
import { TerminoCondicionesComponent } from '../termino-condiciones/termino-condiciones.component';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: [
    './token.scss',  
    '../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../vendor/libs/spinkit/spinkit.scss',   
  ],
  encapsulation: ViewEncapsulation.None

})
export class TokenComponent implements OnInit {

   // Block Ui
   @BlockUI() blockUIPage: NgBlockUI;
   @BlockUI('element') blockUIElement: NgBlockUI;
   @ViewChild('rut')rut: ElementRef;


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
   
  form: FormGroup;
  formUsuarioConPassword : FormGroup;
  token: string;
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;
  usuarioEmpresa : UsuarioEmpresa = new UsuarioEmpresa();
  estadosUsuario : EstadoUsuario[] = [];
  rutValido : Boolean;
  poseePassword : Boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private usuarioEmpresaService : UsuarioEmpresaService,
    private estadoUsuarioService : EstadoUsuarioService,
    private usuarioService : UsuarioService,
    private appService: AppService, 
    public toastrService: ToastrService,
    private dialog : NgbModal
  ) { 
    this.estatoUsuarios();
  }

  async ngOnInit() {

    this.form = this.fb.group({
      rut : [''],
      nombre : [''],
      password: [ null, Validators.required],
      apellidoPaterno : [''],
      apellidoMaterno : [''],
      emailPrincipal : [''],
      emailSecundario : [''],
      confirmPassword: ['', Validators.required]
    }, {
      validator: TokenComponent.passwordMatchValidator
    });

    this.formUsuarioConPassword = this.fb.group({
      rut : ['',Validators.required],
      password: [ null, Validators.required],
    });

    this.route.params.subscribe((params: Params ) => {
      this.token = params['token'];
      this.buscarUsuarioEmpresaByUsuarioAndEmpresa( params['idEmpresa'], params['idUsuario']);
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if(data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 5000);
        }
      });
    });

    this.formUsuarioConPassword.controls['rut'].valueChanges.subscribe(rut=>{
      this.validarRut(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRut(rut);
    });
  }
  async buscarUsuarioEmpresaByUsuarioAndEmpresa(idEmpresa, idUsuario){
    await this.usuarioEmpresaService.buscarUsuarioEmpresaByUsuarioAndEmpresa(idEmpresa,idUsuario).then((result)=>{
      this.usuarioEmpresa = result;
      if(this.usuarioEmpresa[0].usuario.password === null || this.usuarioEmpresa[0].usuario.password === ""){
        this.poseePassword = false;
      }else{
        this.poseePassword = true;
      }
      this.setValuesForm(this.usuarioEmpresa[0]);
    });
    return this.usuarioEmpresa;
  }
  setValuesForm(usuarioEmpresa : UsuarioEmpresa){
    this.form.patchValue({
      rut : RutUtil.rutConPuntosConGuion(usuarioEmpresa.usuario.rut),
      nombre : usuarioEmpresa.usuario.nombre,
      apellidoPaterno : usuarioEmpresa.usuario.apellidoPaterno,
      apellidoMaterno : usuarioEmpresa.usuario.apellidoMaterno,
      emailPrincipal : usuarioEmpresa.usuario.emailPrincipal,
      emailSecundario : usuarioEmpresa.usuario.emailSecundario
    })
  }
  estatoUsuarios(){
    this.estadoUsuarioService.estadosUsuario().subscribe(
      response=>{
        this.estadosUsuario = response;
      }
    )
  }
  async aceptarInvitacion(){
    this.blockPage();
    let usuarioEmpresaDTO = new UsuarioEmpresaDTO();
    usuarioEmpresaDTO = this.usuarioEmpresa[0];
    usuarioEmpresaDTO.fechaActivacion = new Date();
    this.usuarioEmpresa[0].estadoUsuario = this.estadosUsuario.find(x => x.descripcion.toLocaleLowerCase() === 'activo');
    usuarioEmpresaDTO.token = this.token; 
    let responseUsuarioEmpresa = await this.usuarioEmpresaService.actualizarUsuarioEmpresa(usuarioEmpresaDTO);
    this.unblockPageAceptarInitacion();
  }
  async activarUsuarioEmpresa(){
    this.blockPage();
    let usuarioEmpresaDTO = new UsuarioEmpresaDTO();
    this.usuarioEmpresa[0].usuario.nombre = this.form.controls['nombre'].value;
    this.usuarioEmpresa[0].usuario.apellidoPaterno = this.form.controls['apellidoPaterno'].value;
    this.usuarioEmpresa[0].usuario.apellidoMaterno = this.form.controls['apellidoMaterno'].value;
    this.usuarioEmpresa[0].usuario.emailPrincipal = this.form.controls['emailPrincipal'].value;
    this.usuarioEmpresa[0].usuario.emailSecundario = this.form.controls['emailSecundario'].value;
    this.usuarioEmpresa[0].usuario.password = this.form.controls['password'].value;
    this.usuarioEmpresa[0].estadoUsuario = this.estadosUsuario.find(x => x.descripcion.toLocaleLowerCase() === 'activo');
    this.usuarioEmpresa[0].fechaActivacion = new Date();
    
    let responseUsuario = await this.usuarioService.actualizarActivarUsuario(this.usuarioEmpresa[0].usuario);
    usuarioEmpresaDTO = this.usuarioEmpresa[0];
    usuarioEmpresaDTO.token = this.token; 
    let responseUsuarioEmpresa = await this.usuarioEmpresaService.actualizarUsuarioEmpresa(usuarioEmpresaDTO);
    this.unblockPageActivarUsuario();
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
  goLogin(){
    this.router.navigate(["/"]);
  }
  private verificaRut(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.formUsuarioConPassword.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    }else{
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.formUsuarioConPassword.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        }else {
          this.formUsuarioConPassword.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      }else {
        this.formUsuarioConPassword.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }
  validarRut(rut){
    this.rutValido = rutEsValido(rut); 
  }
  validaUsuarioBlurf(){
    if(this.rutValido){
    }else{
      this.formUsuarioConPassword.controls['rut'].setValue('');
    }
  }

  blockPage() {
    this.blockUIPage.start();
  }
  unblockPageActivarUsuario(){
    setTimeout(() => {
      this.blockUIPage.stop();                
      this.router.navigate(['login']);
      this.showToastActivarUsuario();
    }, 3000);
  }

  unblockPageAceptarInitacion(){
    setTimeout(() => {
      this.blockUIPage.stop();                
      this.router.navigate(['login']);
      this.showToastAceptarInvitacion();
    }, 3000);
  }

  showToastActivarUsuario() {
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

    this.toastrService[this.type](this.message || this.getMessageActivarUsuario(), this.title, options);
  }
  

  getMessageActivarUsuario() {
    const msgs = [
      'Usuario Activado Correctamente'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

  
  showToastAceptarInvitacion() {
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

    this.toastrService[this.type](this.message || this.getMessageAceptarInvitacion(), this.title, options);
  }
  

  getMessageAceptarInvitacion() {
    const msgs = [
      'Usuario Activado Correctamente'
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
      'Usuario o Contraseña incorrectos'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }
  modalTerminoCondiciones(){
    console.log("hola")
    const dialog = this.dialog.open(TerminoCondicionesComponent);
  }
}
