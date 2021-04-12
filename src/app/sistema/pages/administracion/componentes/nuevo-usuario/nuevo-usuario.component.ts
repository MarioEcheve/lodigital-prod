import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../../app.service';
import { EstadoUsuario } from '../../../../model/estadoUsuario';
import { Roles } from '../../../../model/roles';
import { Usuario } from '../../../../model/usuario';
import { UsuarioEmpresa } from '../../../../model/usuario-empresa';
import { CorreoService } from '../../../../services/correo.service';
import { EstadoUsuarioService } from '../../../../services/estado-usuario.service';
import { RolService } from '../../../../services/rol.service';
import { UsuarioEmpresaService } from '../../../../services/usuario-empresa.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { RutUtil } from '../../../../util/rut-util';
import { rutEsValido } from '../../../../../sistema/util/validar-rut';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: [
    '../../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../../vendor/libs/spinkit/spinkit.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class NuevoUsuarioComponent implements OnInit {
  @Output() volverUsuario: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() empresaActual: any;
  @Input() empresaUsuarioRolEditar: any;
  usuarioForm: FormGroup;
  roles: Roles[];
  rolSeleccionado: Roles[] = [];
  estadosUsuario: EstadoUsuario[] = [];
  rutValido: Boolean;
  //toast
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
  // fin

  constructor(private fb: FormBuilder,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    public toastrService: ToastrService,
    private appService: AppService,
    private usuarioEmpresaService: UsuarioEmpresaService,
    private estadoUsuarioService: EstadoUsuarioService,
    private correoService: CorreoService) {
    this.inicializarUsuarioForm();
    this.listarRoles();
    this.estatoUsuarios();
  }
  ngOnInit() {
    if (this.empresaUsuarioRolEditar !== null) {
      this.desabilitarUsuarioForm();
      this.sertValuesUsuarioForm(this.empresaUsuarioRolEditar.usuario, this.empresaUsuarioRolEditar.rol);
    }
    this.usuarioForm.controls['rut'].valueChanges.subscribe(rut => {
      this.validarRut(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRut(rut);
    });
  }
  cancelar() {
    this.volverUsuario.emit(false);
  }
  inicializarUsuarioForm() {
    this.usuarioForm = this.fb.group({
      idUsuario: [''],
      rut: [''],
      nombre: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      profesionOficio: [''],
      emailPrincipal: ['', Validators.required],
      emailSecundario: [''],
      telefonoPrincipal: [''],
      telefonoSecundario: [''],
      username: [''],
      password: [''],
      enabled: [''],
      roles: [''],
      confirmEmailPrincipal: ['', Validators.required]
    }, {
      validator: NuevoUsuarioComponent.emailMatchValidator
    });
  }
  sertValuesUsuarioForm(usuario: Usuario, roles: Roles) {
    this.usuarioForm.patchValue({
      idUsuario: usuario.idUsuario,
      rut: RutUtil.rutConPuntosConGuion(usuario.rut),
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      profesionOficio: usuario.profesionOficio,
      emailPrincipal: usuario.emailPrincipal,
      emailSecundario: usuario.emailSecundario,
      telefonoPrincipal: usuario.telefonoPrincipal,
      telefonoSecundario: usuario.telefonoSecundario,
      username: usuario.username,
      password: usuario.password,
      enabled: usuario.enabled,
      roles: roles.nombre
    })
  }
  listarRoles() {
    this.rolService.roles().subscribe(
      (response: any) => {
        this.roles = response;
      }
    )
  }
  async editarUsuario() {
    let usuarioEmpresa = this.empresaUsuarioRolEditar;
    usuarioEmpresa.rol = this.roles.find(x => x.nombre === this.usuarioForm.controls['roles'].value);
    usuarioEmpresa.estadoUsuario = usuarioEmpresa.estadoUsuario;

    let response = await this.usuarioEmpresaService.actualizarUsuarioEmpresaEditarUsuario(usuarioEmpresa);
    if (response !== undefined) {
      this.showToast();
      this.cancelar();
    }
  }
  async crearUsuario() {
    let usuario = new Usuario();
    usuario = this.usuarioForm.value;
    usuario.rut = RutUtil.rutSinPuntosConGuion(this.usuarioForm.controls['rut'].value);
    usuario.rut = usuario.rut.toUpperCase();
    usuario.enabled = false;
    usuario.username = usuario.rut + this.usuarioForm.controls['emailPrincipal'].value;
    usuario.roles = this.rolSeleccionado;
    let responseCrearUsuario = await this.usuarioService.crearUsuario(usuario);
    let usuarioEmpresa = new UsuarioEmpresa();
    usuarioEmpresa.estadoUsuario = this.estadosUsuario.find(x => x.descripcion.toLocaleLowerCase() === 'pendiente');
    usuarioEmpresa.fechaActivacion = new Date();
    usuarioEmpresa.fechaCreacion = new Date();
    usuarioEmpresa.fechaDesactivacion = new Date();
    usuarioEmpresa.usuario = responseCrearUsuario;
    usuarioEmpresa.rol = this.rolSeleccionado[0];
    usuarioEmpresa.empresa = this.empresaActual;
    let responseUsuarioEmpresa = await this.usuarioEmpresaService.crearUsuarioEmpresa(usuarioEmpresa);
    let bodyCorreo = {
      rut: usuario.rut,
      idEmpresa: this.empresaActual.idEmpresa
    }
    let correo = this.correoService.activarUsuarioEmpresa(bodyCorreo);
    this.volverUsuario.emit(false);
  }

  estatoUsuarios() {
    this.estadoUsuarioService.estadosUsuario().subscribe(
      response => {
        this.estadosUsuario = response;
      }
    )
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
      'Usuario Editado Correctamente'
    ];
    this.curMsgIndex++;
    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }
    return msgs[this.curMsgIndex];
  }

  showToastUsuarioExiste() {
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
    this.toastrService[this.type](this.message || this.getMessageUsuarioExiste(), this.title, options);
  }
  getMessageUsuarioExiste() {
    const msgs = [
      'El Usuario ya esta registrado en esta empresa'
    ];
    this.curMsgIndex++;
    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }
    return msgs[this.curMsgIndex];
  }


  showToastUsuarioNoExiste() {
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

    this.toastrService[this.type](this.message || this.getMessageUsuarioNoExiste(), this.title, options);
  }

  showToastUsuarioNoRegistrado() {
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
    this.type = 'warning';

    this.toastrService[this.type](this.message || this.getMessageUsuarioNoRegistrado(), this.title, options);
  }
  getMessageUsuarioNoRegistrado() {
    const msgs = [
      'El Usuario no esta registrado en el sistema'
    ];
    this.curMsgIndex++;
    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }
    return msgs[this.curMsgIndex];
  }

  getMessageUsuarioNoExiste() {
    const msgs = [
      'El Usuario no esta registrado en esta empresa'
    ];
    this.curMsgIndex++;
    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }
    return msgs[this.curMsgIndex];
  }

  async buscarUsuario() {
    let rut = RutUtil.rutSinPuntosConGuion(this.usuarioForm.controls['rut'].value);
    rut = rut.toUpperCase();
    let responseRut = this.validarRut(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
    if (responseRut) {
      let response = await this.usuarioService.usuarioByRut(rut);
      if (response) {
        let usuarioEmpresa = await this.usuarioEmpresaService.buscarUsuarioEmpresaByUsuarioAndEmpresa(this.empresaActual.idEmpresa, response.idUsuario);
        if (usuarioEmpresa.length > 0) {
          this.showToastUsuarioExiste();
          this.cleanFormRegistrado();
        } else {
          this.showToastUsuarioNoExiste();
          this.sertValuesUsuarioForm(response, new Roles());
        }
      } else {
        this.showToastUsuarioNoRegistrado();
        this.cleanFormNoRegistrado();
      }
    } else {
      this.validaUsuarioBlurf();
      this.cleanFormNoRegistrado();
    }
  }
  desabilitarUsuarioForm() {
    this.usuarioForm.controls['rut'].disable();
  }
  cambiarRol(rol) {
    let rolSelected = this.roles.find(x => x.nombre === rol);
    this.rolSeleccionado = [...this.rolSeleccionado, rolSelected];
  }
  private verificaRut(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.usuarioForm.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    } else {
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.usuarioForm.controls['rut'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        } else {
          this.usuarioForm.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      } else {
        this.usuarioForm.controls['rut'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }

  validaUsuarioBlurf() {
    if (this.rutValido) {
    } else {
      this.usuarioForm.controls['rut'].setValue('');
    }
  }
  validarRut(rut) {
    this.rutValido = rutEsValido(rut);
    return this.rutValido;
  }
  cleanFormNoRegistrado() {
    this.usuarioForm.patchValue({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      profesionOficio: "",
      emailPrincipal: "",
      emailSecundario: "",
      telefonoPrincipal: "",
      telefonoSecundario: "",
    })
  }
  cleanFormRegistrado() {
    this.usuarioForm.patchValue({
      rut: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      profesionOficio: "",
      emailPrincipal: "",
      emailSecundario: "",
      telefonoPrincipal: "",
      telefonoSecundario: "",
    })
  }
  static emailMatchValidator(control: AbstractControl) {
    const emailPrincipal: string = control.get('emailPrincipal').value; // get password from our password form control
    const confirmEmailPrincipal: string = control.get('confirmEmailPrincipal').value; // get password from our confirmPassword form control
    // compare is the password math
    if (emailPrincipal !== confirmEmailPrincipal) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmEmailPrincipal').setErrors({ NoPassswordMatch: true });
    }
  }
}
