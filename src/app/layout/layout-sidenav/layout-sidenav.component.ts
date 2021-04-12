import { Component, Input, ChangeDetectionStrategy, AfterViewInit, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'jquery';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { BehaviorSubjectMenu } from '../../sistema/config/BehaviorSubject';
import { Empresa } from '../../sistema/model/empresa';
import { Folio } from '../../sistema/model/folio';
import { Libro } from '../../sistema/model/Libro';
import { UsuarioLibro } from '../../sistema/model/usuarioLibro';
import { EmpresaService } from '../../sistema/services/empresa.service';
import { EncryptService } from '../../sistema/services/encrypt.service';
import { FolioService } from '../../sistema/services/folio.service';
import { UsuarioLibroService } from '../../sistema/services/usuario-libro.service';
import { RutUtil } from '../../sistema/util/rut-util';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layout-sidenav',
  templateUrl: './layout-sidenav.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSidenavComponent implements AfterViewInit {
  @Input() orientation = 'vertical';
  menu : BehaviorSubjectMenu;
  @HostBinding('class.layout-sidenav') private hostClassVertical = false;
  @HostBinding('class.layout-sidenav-horizontal') private hostClassHorizontal = false;
  @HostBinding('class.flex-grow-0') private hostClassFlex = false;
  empresas : any;
  empresaActual : Empresa = new Empresa();
  empresaUsuarioRol : any;
  usuarioLibro : UsuarioLibro;
  libroActual : Libro;
  empresaMandante : Empresa;
  empresaContratista : Empresa;
  constructor(private router: Router, 
              private appService: AppService, 
              private layoutService: LayoutService,
              private encryptService : EncryptService,
              private usuarioLibroService : UsuarioLibroService,
              private folioService : FolioService,
              private activatedRouter : ActivatedRoute,
              private empresaService : EmpresaService
             ) {
    // Set host classes
    this.hostClassVertical = this.orientation !== 'horizontal';
    this.hostClassHorizontal = !this.hostClassVertical;
    this.hostClassFlex = this.hostClassHorizontal;
    this.empresas = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresas')));
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.buscarUsuarioLibrosByLibroAndUsuario();
  }

  ngAfterViewInit() {
    // Safari bugfix
    this.layoutService._redrawLayoutSidenav();
  }

  getClasses() {
    let bg = this.appService.layoutSidenavBg;

    if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
      bg = bg
        .replace(' sidenav-dark', '')
        .replace(' sidenav-light', '')
        .replace('-darker', '')
        .replace('-dark', '');
    }

    return `${this.orientation === 'horizontal' ? 'container-p-x ' : ''} bg-${bg}`;
  }

  isActive(url) {
    return this.router.isActive(url, true);
  }

  isMenuActive(url) {
    return this.router.isActive(url, false);
  }

  isMenuOpen(url) {
    return this.router.isActive(url, false) && this.orientation !== 'horizontal';
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  cambioMenu(){
    this.menu.changeMenuActual(true);
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
  async buscarUsuarioLibrosByLibroAndUsuario(){
    let idLibro = 11;

    let idUsuario = this.empresaUsuarioRol.usuario.idUsuario;
    this.usuarioLibro = await this.usuarioLibroService.buscarUsuarioLibrosByLibroAndUsuario(idLibro,idUsuario);
    
    if(this.usuarioLibro){
      this.libroActual = this.usuarioLibro.libro;
      this.buscaEmpresaMandante(this.libroActual);
      this.buscaEmpresaContratista(this.libroActual);
    }
  }

  async crearFolio(){
    let folio = new Folio();
    folio.idFolio = null;
    folio.idTipoFolio = 1;
    folio.fechaCreacion = new Date();
    folio.idUsuarioCreador = this.usuarioLibro.usuarioEmpresa.usuario.idUsuario;
    folio.asunto = "";
    folio.correlativo = null;
    folio.libro = this.libroActual;

    if(this.usuarioLibro.usuarioEmpresa.empresa.idEmpresa === this.empresaMandante.idEmpresa){
      folio.entidadCreacion = true;
    }else{
      folio.entidadCreacion = false;
    }
    let response = this.folioService.crearFolio(folio);
    if(response){
      this.router.navigate(['/sistema/folio-borrador/', (await response).idFolio]);
    }
  }
}
