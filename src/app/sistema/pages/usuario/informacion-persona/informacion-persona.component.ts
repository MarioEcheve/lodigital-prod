import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Console } from 'console';
import { AlertService } from 'ngx-alerts';
import { UsuarioDTO } from '../../../DTO/usuarioDTO';
import { Usuario } from '../../../model/usuario';
import { EncryptService } from '../../../services/encrypt.service';
import { UsuarioService } from '../../../services/usuario.service';
import { RutUtil } from '../../../util/rut-util';

@Component({
  selector: 'app-informacion-persona',
  templateUrl: './informacion-persona.component.html',
  styles: []
})
export class InformacionPersonaComponent implements OnInit, AfterViewInit {
  empresaUsuarioRol: any;
  empresaActual: any;
  usuario: Usuario;
  editarInformacion = true;
  formInformacion: FormGroup;
  constructor(private encryptService: EncryptService, private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService, private alertService: AlertService) {
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.usuario = this.empresaUsuarioRol.usuario;
    this.usuario.rut = RutUtil.rutConPuntosConGuion(this.usuario.rut);

  }

  ngOnInit() {
    this.inicializar();
    console.log(this.usuario)
  }
  ngAfterViewInit() {
    this.setValue(this.usuario);
  }
  async editar() {
    this.setEnabledValuesInsert();
    this.editarInformacion = false;
  }
  async guardar() {

    let usuarioDTO = new UsuarioDTO;
    usuarioDTO.emailPrincipal = this.formInformacion.controls['emailPrincipal'].value;
    usuarioDTO.emailSecundario = this.formInformacion.controls['emailSecundario'].value;
    usuarioDTO.telefonoPrincipal = this.formInformacion.controls['telefonoPrincipal'].value;
    usuarioDTO.telefonoSecundario = this.formInformacion.controls['telefonoSecundario'].value;
    usuarioDTO.profesionOficio = this.formInformacion.controls['profesionOficio'].value;
    usuarioDTO.rut = RutUtil.rutSinPuntosConGuion(this.usuario.rut);

    this.usuario.emailPrincipal = usuarioDTO.emailPrincipal;
    this.usuario.emailSecundario = usuarioDTO.emailSecundario;
    this.usuario.telefonoPrincipal = usuarioDTO.telefonoPrincipal;
    this.usuario.telefonoSecundario = usuarioDTO.telefonoSecundario;
    this.usuario.profesionOficio = usuarioDTO.profesionOficio;

    let response = await this.usuarioService.actualizarUsuario(usuarioDTO);
    this.empresaUsuarioRol.usuario = this.usuario;
    localStorage.setItem("empresaUsuarioRol", this.encryptService.encrypt(JSON.stringify(this.empresaUsuarioRol)));
    if (response === 1) {
      this.editarInformacion = true;
      this.setDisabledValuesInsert();
      this.showAlerts(true, "Informacion Modificada correctamente");
    } else {
      this.showAlerts(false, "Error al Actualizar la informacion");
    }
  }
  cancelar() {

    this.editarInformacion = true;
    this.setDisabledValuesInsert();
  }
  inicializar() {
    this.formInformacion = this.fb.group({
      rut: [],
      nombre: [],
      apellidoPaterno: [],
      apellidoMaterno: [],
      profesionOficio: [],
      emailPrincipal: [],
      emailSecundario: [],
      telefonoPrincipal: [],
      telefonoSecundario: [],
    });
    this.disiabledFormValues();
  }
  setValue(usuario: Usuario) {
    this.formInformacion.patchValue({
      rut: usuario.rut,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      profesionOficio: usuario.profesionOficio,
      emailPrincipal: usuario.emailPrincipal,
      emailSecundario: usuario.emailSecundario,
      telefonoPrincipal: usuario.telefonoPrincipal,
      telefonoSecundario: usuario.telefonoSecundario,
    });
  }
  disiabledFormValues() {
    this.formInformacion.controls['rut'].disable();
    this.formInformacion.controls['nombre'].disable();
    this.formInformacion.controls['apellidoPaterno'].disable();
    this.formInformacion.controls['apellidoMaterno'].disable();
    this.formInformacion.controls['profesionOficio'].disable();
    this.formInformacion.controls['emailPrincipal'].disable();
    this.formInformacion.controls['emailSecundario'].disable();
    this.formInformacion.controls['telefonoPrincipal'].disable();
    this.formInformacion.controls['telefonoSecundario'].disable();
  }

  setEnabledValuesInsert() {
    this.formInformacion.controls['profesionOficio'].enable();
    this.formInformacion.controls['emailPrincipal'].enable();
    this.formInformacion.controls['emailSecundario'].enable();
    this.formInformacion.controls['telefonoPrincipal'].enable();
    this.formInformacion.controls['telefonoSecundario'].enable();
  }
  setDisabledValuesInsert() {
    this.formInformacion.controls['profesionOficio'].disable();
    this.formInformacion.controls['emailPrincipal'].disable();
    this.formInformacion.controls['emailSecundario'].disable();
    this.formInformacion.controls['telefonoPrincipal'].disable();
    this.formInformacion.controls['telefonoSecundario'].disable();
  }

  showAlerts(value, mensaje): void {
    if (value) {
      this.alertService.success(mensaje);
    } else {
      this.alertService.danger(mensaje);
    }
  }

}
