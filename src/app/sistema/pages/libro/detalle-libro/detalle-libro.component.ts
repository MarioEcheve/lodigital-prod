import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { element } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../app.service';
import { EstadoLibro } from '../../../model/estadoLibro';
import { EstadoUsuarioLibro } from '../../../model/estadoUsuarioLibro';
import { Libro } from '../../../model/Libro';
import { PerfilUsuarioLibro } from '../../../model/perfilUsuarioLibro';
import { TipoFirma } from '../../../model/tipoFirna';
import { TipoLibro } from '../../../model/tipoLibro';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { UsuarioLibro } from '../../../model/usuarioLibro';
import { EstadoLibroService } from '../../../services/estado-libro.service';
import { EstadoUsuarioLibroService } from '../../../services/estado-usuario-libro.service';
import { LibroService } from '../../../services/libro.service';
import { PerfilUsuarioLibroService } from '../../../services/perfil-usuario-libro.service';
import { TipoFirmaService } from '../../../services/tipo-firma.service';
import { TipoLibroService } from '../../../services/tipo-libro.service';
import { UsuarioEmpresaService } from '../../../services/usuario-empresa.service';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
import { RutUtil } from '../../../util/rut-util';
import { ModalCrearUsuarioLibroComponent } from '../components/modal-crear-usuario-libro/modal-crear-usuario-libro.component';

@Component({
  selector: 'app-detalle-libro',
  templateUrl: './detalle-libro.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../vendor/libs/spinkit/spinkit.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class DetalleLibroComponent implements OnInit {
  libro: Libro;
  formLibro: FormGroup;
  listaEstadosLibro: EstadoLibro[] = [];
  listaTiposLibro: TipoLibro[] = [];
  listaTipoFirma: TipoFirma[] = [];
  listaPerfilUsuarioLibro: PerfilUsuarioLibro[] = [];
  listaEstadoUsuarioLibro: EstadoUsuarioLibro[] = [];
  listaUsuariosLibroMandante: UsuarioLibro[] = [];
  listaUsuariosLibroContratista: UsuarioLibro[] = [];
  editarLibro = false;

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

  constructor(private activatedRoute: ActivatedRoute,
    private libroService: LibroService,
    private fb: FormBuilder,
    private estadoLibroService: EstadoLibroService,
    private tipoLibroService: TipoLibroService,
    private tipoFirmaService: TipoFirmaService,
    private appService: AppService,
    public toastrService: ToastrService,
    private dialog: NgbModal,
    private usuarioLibroService: UsuarioLibroService,
    private usuarioEmpresaService: UsuarioEmpresaService) {
    this.inicializarForm();
    this.disabledValuesFormLibro();
    this.buscarLibro();
    this.listarEstadoLibro();
    this.listarTipoLibroService();
    this.listarTipoFirma();
  }

  ngOnInit() {

  }
  inicializarForm() {
    this.formLibro = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      tipoLibro: ['', Validators.required],
      tipoFirma: ['', Validators.required],
      fechaCreacion: [''],
      fechaApertura: [''],
      fechaCierre: ['']
    });
  }
  async buscarLibro() {
    let idLibro = this.activatedRoute.snapshot.params['idLibro'];
    let response = await this.libroService.libroById(idLibro);
    this.libro = response;
    this.setValesFormLibro(this.libro);
    this.buscarUsuariosMandante();
    this.buscarUsuariosContratista();
  }
  async listarEstadoLibro() {
    let response = await this.estadoLibroService.listar();
    this.listaEstadosLibro = response;
  }

  async listarTipoLibroService() {
    let response = await this.tipoLibroService.listar();
    this.listaTiposLibro = response;
  }

  async listarTipoFirma() {
    let response = await this.tipoFirmaService.listar();
    this.listaTipoFirma = response;
  }

  setValesFormLibro(libro: Libro) {
    this.formLibro.patchValue({
      codigo: libro.codigo,
      nombre: libro.nombre,
      descripcion: libro.descripcion,
      tipoLibro: libro.tipoLibro.descripcion,
      tipoFirma: libro.tipoFirma.descripcion,
      fechaCreacion: libro.fechaCreacion
    })
  }
  disabledValuesFormLibro() {
    this.formLibro.controls['codigo'].disable();
    this.formLibro.controls['nombre'].disable();
    this.formLibro.controls['descripcion'].disable();
    this.formLibro.controls['tipoLibro'].disable();
    this.formLibro.controls['tipoFirma'].disable();
    this.formLibro.controls['fechaCreacion'].disable();
  }
  enabledValuesFormLibro() {
    this.formLibro.controls['codigo'].enable();
    this.formLibro.controls['nombre'].enable();
    this.formLibro.controls['descripcion'].enable();
    this.formLibro.controls['tipoLibro'].enable();
    this.formLibro.controls['tipoFirma'].enable();
    this.formLibro.controls['fechaCreacion'].enable();
  }
  editar() {
    this.editarLibro = true;
    this.enabledValuesFormLibro();
  }
  cancelar() {
    this.disabledValuesFormLibro();
    this.setValesFormLibro(this.libro);
    this.editarLibro = false;
  }
  async editarLibroAction() {
    this.libro.codigo = this.formLibro.controls['codigo'].value;
    this.libro.nombre = this.formLibro.controls['nombre'].value;
    this.libro.descripcion = this.formLibro.controls['descripcion'].value;
    this.libro.tipoFirma = this.listaTipoFirma.find(x => x.descripcion === this.formLibro.controls['tipoFirma'].value);
    this.libro.tipoLibro = this.listaTiposLibro.find(x => x.descripcion === this.formLibro.controls['tipoLibro'].value);
    let response = await this.libroService.save(this.libro);
    if (response) {
      this.editarLibro = false;
      this.disabledValuesFormLibro();
      this.showToast('Libro Editado Correctamente');
    }
  }
  showToast(mensaje) {
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
    this.toastrService[this.type](this.message || this.getMessage(mensaje), this.title, options);
  }

  getMessage(mensaje) {
    const msgs = [
      mensaje
    ];
    this.curMsgIndex++;
    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }
    return msgs[this.curMsgIndex];
  }
  async nuevoUsuarioMandante(value) {
    let usuariosMandante;
    usuariosMandante = await this.usuarioEmpresaService.usuariosEmpresasByCompany(this.libro.contrato.idEmpresaMandante);
    let usuariosContratista = [];
    usuariosContratista = await this.usuarioEmpresaService.usuariosEmpresasByCompany(this.libro.contrato.idEmpresaContratista);
    let usuariosEmpresa = [];
    let usuarioEmpresaAsignados: UsuarioEmpresa[] = [];

    if (value) {
      for await (let elemento of this.listaUsuariosLibroMandante) {
        usuarioEmpresaAsignados = [...usuarioEmpresaAsignados, elemento.usuarioEmpresa];
      }
      usuariosEmpresa = await this.sacaDataArray(usuariosMandante, usuarioEmpresaAsignados);
    } else {
      for await (let elemento of this.listaUsuariosLibroContratista) {
        usuarioEmpresaAsignados = [...usuarioEmpresaAsignados, elemento.usuarioEmpresa];
      }
      usuariosEmpresa = await this.sacaDataArray(usuariosContratista, usuarioEmpresaAsignados);
    }
    const dialog = this.dialog.open(ModalCrearUsuarioLibroComponent);
    dialog.componentInstance.libro = this.libro;
    dialog.componentInstance.mandante = value;
    dialog.componentInstance.usuariosEmpresa = usuariosEmpresa;

    dialog.result.then((result) => {
    }, (reason) => {
      if (reason === 1) {
        this.buscarUsuariosMandante();
        this.buscarUsuariosContratista();
        this.showToast('Usuario Creado Correctamente');
      }
    });
  }

  async sacaDataArray(arrayResponse, usuariosAsignados) {
    if (usuariosAsignados.length === 0) {
      return arrayResponse;
    } else {
      await usuariosAsignados.forEach(element => {
        arrayResponse.splice(element, 1);
      });
    }
    return arrayResponse;
  }
  async buscarUsuariosMandante() {
    let response = await this.usuarioLibroService.buscarUsuarioLibrosByLibro(this.libro.idLibro);
    response.forEach(element => {
      element.usuarioEmpresa.usuario.rut = RutUtil.rutConPuntosConGuion(element.usuarioEmpresa.usuario.rut);
    });
    let listaMandante = response.filter(x => x.libro.contrato.idEmpresaMandante === x.usuarioEmpresa.empresa.idEmpresa);
    this.listaUsuariosLibroMandante = listaMandante;
  }
  async buscarUsuariosContratista() {
    let response = await this.usuarioLibroService.buscarUsuarioLibrosByLibro(this.libro.idLibro);
    response.forEach(element => {
      element.usuarioEmpresa.usuario.rut = RutUtil.rutConPuntosConGuion(element.usuarioEmpresa.usuario.rut);
    });
    let listaContratista = response.filter(x => x.libro.contrato.idEmpresaContratista === x.usuarioEmpresa.empresa.idEmpresa);
    this.listaUsuariosLibroContratista = listaContratista;
  }
  async editarMandante(usuario, value) {
    let usuariosMandante = await this.usuarioEmpresaService.usuariosEmpresasByCompany(this.libro.contrato.idEmpresaMandante);
    let usuariosContratista = await this.usuarioEmpresaService.usuariosEmpresasByCompany(this.libro.contrato.idEmpresaContratista);
    let usuariosEmpresa = [];
    if (value) {
      usuariosEmpresa = usuariosMandante;
    } else {
      usuariosEmpresa = usuariosContratista;
    }
    const dialog = this.dialog.open(ModalCrearUsuarioLibroComponent);
    dialog.componentInstance.libro = this.libro;
    dialog.componentInstance.mandante = value;
    dialog.componentInstance.usuarioLibro = usuario;
    dialog.componentInstance.usuariosEmpresa = usuariosEmpresa;
    
    dialog.result.then((result) => {
    }, (reason) => {
      if (reason === 1) {
        this.buscarUsuariosMandante();
        this.buscarUsuariosContratista();
        this.showToast('Usuario Editado Correctamente');
      }
    });
  }
}
