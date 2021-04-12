import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppService } from '../../../../app.service';
import { LayoutService } from '../../../../layout/layout.service';
import { Empresa } from '../../../model/empresa';
import { Folio } from '../../../model/folio';
import { Libro } from '../../../model/Libro';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { UsuarioLibro } from '../../../model/usuarioLibro';
import { EmpresaService } from '../../../services/empresa.service';
import { EncryptService } from '../../../services/encrypt.service';
import { FolioService } from '../../../services/folio.service';
import { LibroService } from '../../../services/libro.service';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
import { RutUtil } from '../../../util/rut-util';


@Component({
  selector: 'app-resumen-folio',
  templateUrl: './resumen-folio.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-perfect-scrollbar/ngx-perfect-scrollbar.scss',
    '../../../../../vendor/styles/pages/messages.scss',
    './resumen-folio.component.scss',

  ],
})
export class ResumenFolioComponent implements AfterViewInit, OnDestroy, OnInit {
  // implementacion datatable //
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dtTrigger: Subject<any> = new Subject<any>();

  sideboxOpen = false;
  loadingIndicator = true;
  rows = [];
  temp = [];
  selected = [];

  // Mail boxes
  currentMailBox = 'inbox';
  mailBoxes = {
    inbox: { title: 'Folios Emitidos', icon: 'ion ion-md-filing', count: 150 },
    sent: { title: 'Emitidos Mandante', icon: 'fas fa-building', count: 150 },
    drafts: { title: 'Emitidos Contratista', icon: 'fas fa-snowplow', count: 150 },
    spam3: { title: 'Sin Respuesta', icon: 'ion ion-ios-warning', count: 150 },
    spam: { title: 'Sin Confirmar', icon: 'ion ion ion-md-folder-open', count: 150 },
    spam2: { title: 'Favoritos', icon: 'ion ion-ios-star', count: 150 },
    trash: { title: 'Borradores', icon: 'ion ion-md-document', count: 150 }
  };
  
  empresaActual : Empresa;
  empresaUsuarioRol : UsuarioEmpresa;
  listaFolios : Folio[] = [];
  usuarioLibro : UsuarioLibro;
  libroActual : Libro;
  empresaMandante : Empresa;
  empresaContratista : Empresa;
  listaLibroUsuario  : UsuarioLibro[] = [];
  libroSeleccionado;
  controlLibroSeleccionado = new FormControl("",[]);


  constructor(private appService: AppService, private layoutService: LayoutService, 
              private folioService : FolioService,
              private activatedRouter : ActivatedRoute,
              private router : Router,
              private usuarioLibroService : UsuarioLibroService,
              private encryptService : EncryptService,
              private empresaService : EmpresaService,
              private libroService : LibroService) {
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.appService.pageTitle = 'LODigital - Listado Folios';
    this.buscarFoliosPorLibro();
    this.buscarUsuarioLibrosByLibroAndUsuario();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      order:[[4, 'desc']],
      lengthMenu : [ 20 , 50 , 100 ],
      processing: true,      
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de un total de _TOTAL_ folios',
        infoEmpty: 'De 0 a 0 de 0 folios',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        }
      }
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  ngAfterViewInit() {
    setTimeout(() => this.layoutService.setCollapsed(true, false));
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  objectKeys(o) {
    return Object.keys(o);
  }

  toggleSelect($event, message) {
    if ($event.target.checked) {
      this.selected.push(message);
    } else {
      this.selected.splice(this.selected.indexOf(message), 1);
    }
  }
  async buscarFoliosPorLibro(){
    this.listaFolios = [];
    let idLibro = this.activatedRouter.snapshot.params["idLibro"];
    let response = await this.folioService.folioByLibro(idLibro);
    this.listaFolios = response;
    this.cambiarLibro(idLibro);
    this.dtTrigger.next();
  }
  async buscarUsuarioLibrosByLibroAndUsuario(){
    let idLibro = this.activatedRouter.snapshot.params["idLibro"];
    this.controlLibroSeleccionado.setValue(idLibro);
    let idUsuario = this.empresaUsuarioRol.usuario.idUsuario;
    this.usuarioLibro = await this.usuarioLibroService.buscarUsuarioLibrosByLibroAndUsuario(idLibro,idUsuario);
    if(this.usuarioLibro){
      this.libroActual = this.usuarioLibro.libro;
      this.buscaEmpresaMandante(this.libroActual);
      this.buscaEmpresaContratista(this.libroActual);
      this.librosUsuario(this.usuarioLibro.usuarioEmpresa.usuario.idUsuario, this.usuarioLibro.libro.contrato.id);
    }
  }

  async buscaEmpresaMandante(libro : Libro){
    let response = await this.empresaService.obtenerEmpresaById(libro.contrato.idEmpresaMandante);
    this.empresaMandante = response;
    this.empresaMandante.rut = RutUtil.rutConPuntosConGuion(this.empresaMandante.rut);
  }
  async buscaEmpresaContratista(libro : Libro){
    let response = await this.empresaService.obtenerEmpresaById(libro.contrato.idEmpresaContratista);
    this.empresaContratista = response;
    this.empresaContratista.rut = RutUtil.rutConPuntosConGuion(this.empresaContratista.rut);

  }
  async crearFolio(){
    let folio = new Folio();
    folio.idFolio = null;
    folio.idTipoFolio = 1;
    folio.fechaCreacion = new Date();
    folio.idUsuarioCreador = this.usuarioLibro.usuarioEmpresa.usuario.idUsuario;
    folio.asunto = "";
    folio.correlativo = null;
    folio.libro = await this.libroService.libroById(this.controlLibroSeleccionado.value);
    folio.fechaModificacion = new Date();
    if(this.usuarioLibro.usuarioEmpresa.empresa.idEmpresa === this.empresaMandante.idEmpresa){
      folio.entidadCreacion = true;
    }else{
      folio.entidadCreacion = false;
    }
    localStorage.setItem("datosCrearFolio" , JSON.stringify(folio))
    this.router.navigate(['/sistema/folio-borrador/']);

  }
  folioBorrador(folio){
    this.router.navigate(['/sistema/folio-borrador/', folio.idFolio]);
  }
  async librosUsuario(idUsuario,idContrato){
    let response = await this.usuarioLibroService.buscarUsuarioLibrosByUsuario(idUsuario,idContrato);
    this.listaLibroUsuario = response;
  }
  async cambiarLibro(idLibro?){
    if(idLibro !== undefined){
      this.controlLibroSeleccionado.setValue(idLibro);
    }
    const response = await this.folioService.folioByLibro(this.controlLibroSeleccionado.value);
    this.listaFolios = response;
    this.rerender();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  detalleLibro(){
    this.router.navigate(['/sistema/detalle-libro/', this.controlLibroSeleccionado.value]);
  }
  folioFirmado(folio){
    this.router.navigate(['/sistema/folio-firmado/', folio.idFolio]);
  }
}
