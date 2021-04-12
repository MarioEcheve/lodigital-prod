import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Empresa } from '../../../../model/empresa';
import { EstadoUsuarioLibro } from '../../../../model/estadoUsuarioLibro';
import { PerfilUsuarioLibro } from '../../../../model/perfilUsuarioLibro';
import { UsuarioEmpresa } from '../../../../model/usuario-empresa';
import { UsuarioLibro } from '../../../../model/usuarioLibro';
import { EncryptService } from '../../../../services/encrypt.service';
import { EstadoUsuarioLibroService } from '../../../../services/estado-usuario-libro.service';
import { PerfilUsuarioLibroService } from '../../../../services/perfil-usuario-libro.service';
import { UsuarioEmpresaService } from '../../../../services/usuario-empresa.service';
import { UsuarioLibroService } from '../../../../services/usuario-libro.service';
import { RutUtil } from '../../../../util/rut-util';

@Component({
  selector: 'app-modal-crear-usuario-libro',
  templateUrl: './modal-crear-usuario-libro.component.html',
  styleUrls: [
    '../../../../../../vendor/libs/angular-2-dropdown-multiselect/angular-2-dropdown-multiselect.scss',
    '../../../../../../vendor/libs/ng-select/ng-select.scss'
  ]
})
export class ModalCrearUsuarioLibroComponent implements OnInit {
  @Input() public libro;
  @Input() public mandante;
  @Input() public usuarioLibro;
  @Input() public usuariosEmpresa;
  form: FormGroup;
  listaPerfilUsuarioLibro: PerfilUsuarioLibro[] = [];
  listaEstadoUsuarioLibro: EstadoUsuarioLibro[] = [];
  empresaActual: Empresa;
  empresaUsuarioRol: UsuarioEmpresa;
  disabled = false;
  singleSelectValue: any;
  multipleSelectValue: Array<any> = [];

  constructor(private fb: FormBuilder,
    private dialog: NgbModal,
    private perfilUsuarioLibroService: PerfilUsuarioLibroService,
    private estadoUsuarioLibroService: EstadoUsuarioLibroService,
    private encryptService: EncryptService,
    private usuarioLibroService: UsuarioLibroService) {

    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.inicializarForm();
    this.listarPerfilUsuarioLibros();
    this.listarEstadoUsuarioLibro();
  }
  ngOnInit() {
    if (this.usuarioLibro) {
      this.setValueForm(this.usuarioLibro);
      this.disabledForm();
    }
    this.crearNombreCompletoEmpresa();
  }
  async listarPerfilUsuarioLibros() {
    let response = await this.perfilUsuarioLibroService.ListaPerfilUsuarioLibro();
    this.listaPerfilUsuarioLibro = response;
  }
  async listarEstadoUsuarioLibro() {
    let response = await this.estadoUsuarioLibroService.ListaEstadoUsuarioLibro();
    this.listaEstadoUsuarioLibro = response;
  }
  inicializarForm() {
    this.form = this.fb.group({
      nombre: [],
      cargo: [],
      usuarioEmpresa: [],
      perfilUsuarioLibro: [],
      estadoUsuarioLibro: []
    });
  }
  cancelar() {
    this.dialog.dismissAll();
  }
  async guardar() {
    let usuarioLibro = new UsuarioLibro();
    usuarioLibro.cargo = this.form.controls['cargo'].value;
    usuarioLibro.estadoUsuarioLibro = this.listaEstadoUsuarioLibro.find(x => x.descripcion.toUpperCase() === "ACTIVO");
    usuarioLibro.perfilUsuarioLibro = this.listaPerfilUsuarioLibro.find(x => x.descripcion === this.form.controls['perfilUsuarioLibro'].value);
    usuarioLibro.libro = this.libro;
    usuarioLibro.usuarioEmpresa = this.usuariosEmpresa.find(x => x.nombreCompleto === this.form.controls['nombre'].value);
    usuarioLibro.mandante = this.mandante;
    let response = await this.usuarioLibroService.crearUsuarioLibro(usuarioLibro);
    if (response) {
      this.dialog.dismissAll(1);
    }
  }
  setValueForm(usuarioLibro: UsuarioLibro) {
    this.form.patchValue({
      nombre: `${usuarioLibro.usuarioEmpresa.usuario.nombre} ${usuarioLibro.usuarioEmpresa.usuario.apellidoPaterno} ${usuarioLibro.usuarioEmpresa.usuario.apellidoMaterno} | RUT:${RutUtil.rutConPuntosConGuion(usuarioLibro.usuarioEmpresa.usuario.rut)}`,
      cargo: usuarioLibro.cargo,
      usuarioEmpresa: usuarioLibro,
      perfilUsuarioLibro: usuarioLibro.perfilUsuarioLibro.descripcion,
      estadoUsuarioLibro: usuarioLibro.estadoUsuarioLibro.descripcion
    });
  }
  async editar() {
    this.usuarioLibro.cargo = this.form.controls['cargo'].value;
    this.usuarioLibro.estadoUsuarioLibro = this.listaEstadoUsuarioLibro.find(x => x.descripcion === this.form.controls['estadoUsuarioLibro'].value);
    this.usuarioLibro.perfilUsuarioLibro = this.listaPerfilUsuarioLibro.find(x => x.descripcion === this.form.controls['perfilUsuarioLibro'].value);
    this.usuarioLibro.libro = this.libro;
    this.usuarioLibro.mandante = this.mandante;
    let response = await this.usuarioLibroService.editarUsuarioLibro(this.usuarioLibro);
    if (response) {
      this.dialog.dismissAll(1);
    }
  }
  crearNombreCompletoEmpresa() {
    this.usuariosEmpresa.forEach(element => {
      element.nombreCompleto = `${element.usuario.nombre} ${element.usuario.apellidoPaterno} ${element.usuario.apellidoMaterno} | RUT:${RutUtil.rutConPuntosConGuion(element.usuario.rut)}`
    });
  }
  disabledForm() {
    this.form.controls['nombre'].disable();
  }

}
