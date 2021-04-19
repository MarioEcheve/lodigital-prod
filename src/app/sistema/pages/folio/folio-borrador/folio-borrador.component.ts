import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { AppService } from '../../../../app.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FolioService } from '../../../services/folio.service';
import { Folio } from '../../../model/folio';
import { EmpresaService } from '../../../services/empresa.service';
import { EncryptService } from '../../../services/encrypt.service';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { Empresa } from '../../../model/empresa';
import { Libro } from '../../../model/Libro';
import { RutUtil } from '../../../util/rut-util';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
import { UsuarioLibro } from '../../../model/usuarioLibro';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoFolioService } from '../../../services/tipo-folio.service';
import { ConfiguracionTipoFolioTipoLibroService } from '../../../services/configuracion-tipo-folio-tipo-libro.service';
import { ConfiguracionTipoFolioTipoLibro } from '../../../model/ConfiguracionTipoFolioTipoLibro';
import { ToastrService } from 'ngx-toastr';
import { FolioReferenciaComponent } from './components/folio-referencia/folio-referencia.component';
import { AlertService } from 'ngx-alerts';
import { ModalConfirmarEliminacionComponent } from '../components/modal-confirmar-eliminacion/modal-confirmar-eliminacion.component';
import { VisualizarPdfComponent } from '../components/visualizar-pdf/visualizar-pdf.component';
import { LibroService } from '../../../services/libro.service';
import { UsuarioService } from '../../../services/usuario.service';
import { GenerarCodigoVerificacionDTO } from '../../../DTO/GenerarCodigoVerificacionDTO';
import { DatePipe } from '@angular/common';
import { FolioReferenciaService } from '../../../services/folio-referencia.service';
import { BehaviorSubject } from 'rxjs';
const now = new Date();

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-folio-borrador',
  templateUrl: './folio-borrador.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-markdown-editor/ngx-markdown-editor.scss',
    '../../../../../vendor/libs/quill/typography.scss',
    '../../../../../vendor/libs/quill/editor.scss',
    '../../../../../vendor/libs/ngx-dropzone-wrapper/ngx-dropzone-wrapper.scss',
    './folio-borrador.component.scss',
    '../../../../../vendor/libs/ngb-datepicker/ngb-datepicker.scss',
    '../../../../../vendor/libs/ngb-timepicker/ngb-timepicker.scss',
    '../../../../../vendor/libs/ngx-color-picker/ngx-color-picker.scss',
    '../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../vendor/libs/spinkit/spinkit.scss',  
   
  ],
  providers: [DatePipe]
  //encapsulation : ViewEncapsulation.None
})
export class FolioBorradorComponent implements OnInit {
  @ViewChild(DropzoneDirective) dropzoneInstance: DropzoneDirective;
  isRTL: boolean;
  folio : Folio;
  empresaActual : Empresa;
  empresaUsuarioRol : UsuarioEmpresa;
  empresaMandante : Empresa;
  empresaContratista : Empresa;
  listaUsuarioLibro : UsuarioLibro[] = [];
  formContrato : FormGroup;
  listaTipoFolio :  ConfiguracionTipoFolioTipoLibro[] = [];
  idFolio;
  editar : Boolean = false;
  solicitaRespuesta : Boolean = false;
  folioReferencias  = [];
  folioReferenciasNombre  = [];
  folioReferenciaDelete = [];
  model: NgbDateStruct = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };

  displayMonths = 1;
  navigation = 'select';
  disabled = false;

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  config = {
    placeholder: '',
    tabsize: 2,
    height: '300px',
    uploadImagePath: '/api/upload',
    toolbar: [
        ['misc', ['undo', 'redo']],
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],        
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style', 'ul', 'ol', 'paragraph']],
        ['insert', ['picture']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }

  
  dropzoneConfig = {
    url: '/upload',
    parallelUploads: 2,
    maxFilesize:     50000,
    filesizeBase:    1000,
    addRemoveLinks:  true,
    previewTemplate: `
      <div class="dz-preview dz-file-preview">
        <div class="dz-details">
          <div class="dz-thumbnail">
            <img data-dz-thumbnail>
            <span class="dz-nopreview">No preview</span>
            <div class="dz-success-mark"></div>
            <div class="dz-error-mark"></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <div class="progress">
              <div class="progress-bar progress-bar-primary"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                data-dz-uploadprogress></div>
            </div>
          </div>
          <div class="dz-filename" data-dz-name></div>
          <div class="dz-size" data-dz-size></div>
        </div>
      </div>`
  };
  
  uploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  hasBaseDropZoneOver = false;

  constructor(private appService: AppService,calendar: NgbCalendar, 
              private activatedRoute : ActivatedRoute,
              private folioService : FolioService,
              private encryptService : EncryptService,
              private empresaService : EmpresaService,
              private router : Router,
              private usuarioLibroService : UsuarioLibroService, 
              private fb : FormBuilder,
              private tipoFolioService : TipoFolioService,
              private configuracionTipoFolioTipoLibroService : ConfiguracionTipoFolioTipoLibroService,
              public toastrService: ToastrService,
              private dialog : NgbModal,
              private alertService: AlertService,
              private libroService : LibroService,
              private usuarioService : UsuarioService,
              public datepipe: DatePipe,
              private folioReferenciaService : FolioReferenciaService) {
                
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.appService.pageTitle = 'LODigital - Folio Borrador';
    this.isRTL = appService.isRTL;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.inicializarForm();
  }


  ngAfterViewInit() {
    const component = this;

    this.dropzoneInstance.dropzone().uploadFiles = function(files) {
      const minSteps         = 6;
      const maxSteps         = 60;
      const timeBetweenSteps = 100;
      const bytesPerStep     = 100000;
      const isUploadSuccess  = Math.round(Math.random());

      const self = this;

      for (let i = 0; i < files.length; i++) {

        const file = files[i];
        const totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

        for (let step = 0; step < totalSteps; step++) {
          const duration = timeBetweenSteps * (step + 1);

          setTimeout(function(_file, _totalSteps, _step) {
            return function() {
              _file.upload = {
                progress: 100 * (_step + 1) / _totalSteps,
                total: _file.size,
                bytesSent: (_step + 1) * _file.size / _totalSteps
              };

              self.emit('uploadprogress', _file, _file.upload.progress, _file.upload.bytesSent);
              if (_file.upload.progress === 100) {

                if (isUploadSuccess) {
                  _file.status = component.dropzoneInstance.DZ_SUCCESS;
                  self.emit('success', _file, 'success', null);
                } else {
                  _file.status = component.dropzoneInstance.DZ_ERROR;
                  self.emit('error', _file, 'Some upload error', null);
                }

                self.emit('complete', _file);
                self.processQueue();
              }
            };
          }(file, totalSteps, step), duration);
        }
      }
    };
  }



  fileOver(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  ngOnInit(){
    this.idFolio = this.activatedRoute.snapshot.params["idFolio"];
    if(this.idFolio){
       this.buscaFolio();
       this.editar = true;
    }else{
      this.buscaFolio();
      this.editar = false;
    }
    this.formContrato.controls['solicitaRespuesta'].valueChanges.subscribe(x=>{
      this.solicitaRespuesta = x;
      if(!x){
        this.formContrato.controls['fechaRequerida'].setValue(null);
        this.formContrato.controls['fechaRequerida'].clearValidators();
        this.formContrato.controls['fechaRequerida'].updateValueAndValidity();

      }else{
        this.formContrato.controls['fechaRequerida'].setValidators([Validators.required]);
      }
    });
    this.folioService.getListaFoliosRelacionadosAgregadosSubject().subscribe(x=>{
      console.log(x)
    });
  }



  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  async guardarFolio(){
    if(this.folio){
      this.folio.fechaModificacion = new Date();
    }else{
      this.folio.fechaModificacion = new Date();
      this.folio.fechaCreacion = new Date();
    }
    let fechaRequerida = "";
    if(this.formContrato.controls['fechaRequerida'].value){
      fechaRequerida = this.formContrato.controls['fechaRequerida'].value.year + '-' + this.formContrato.controls['fechaRequerida'].value.month+'-'+this.formContrato.controls['fechaRequerida'].value.day;
    }
    let folio = JSON.parse(localStorage.getItem("datosCrearFolio"));
    this.folio.idReceptor = this.formContrato.controls['receptor'].value;
    this.folio.configuracionTipoFolioTipoLibro = this.listaTipoFolio.find(x=> x.tipoFolio.nombre === this.formContrato.controls['tipoFolio'].value);
    this.folio.asunto =  this.formContrato.controls['asunto'].value;
    this.folio.anotacion = this.formContrato.controls['anotacion'].value;
    if(fechaRequerida !== null){
      this.folio.fechaRequerida = new Date(fechaRequerida);
    }else{
      this.folio.fechaRequerida = null;
    }
    let receptor = this.listaUsuarioLibro.find(x=> x.usuarioEmpresa.usuario.idUsuario === parseInt(this.formContrato.controls['receptor'].value));
    this.folio.usuarioReceptor = `${receptor.usuarioEmpresa.usuario.nombre} ${receptor.usuarioEmpresa.usuario.apellidoPaterno} ${receptor.usuarioEmpresa.usuario.apellidoMaterno}`;
    this.folio.usuarioCreador = `${this.empresaUsuarioRol.usuario.nombre} ${this.empresaUsuarioRol.usuario.apellidoPaterno} ${this.empresaUsuarioRol.usuario.apellidoMaterno}`;
    
    if(this.empresaUsuarioRol.empresa.idEmpresa === this.empresaMandante.idEmpresa){
      this.folio.entidadCreacion = true;
    }else{
      this.folio.entidadCreacion = false;
    }

    this.folio = await this.folioService.crearFolio(this.folio); 
    if(this.folio){
      if(folio){
        this.showToast(true,'Folio Creado Correctamente');
        this.router.navigate(['/sistema/folio-borrador/', this.folio.idFolio]);
        localStorage.setItem("datosCrearFolio", null);
        this.ingresaFolioReferencia();
        this.eliminarFolioReferencia();
      }else{
        this.showToast(true,'Folio Actualizado Correctamente');
        this.ingresaFolioReferencia();
        this.eliminarFolioReferencia();
      }
    }
  }
  showToast(value, mensaje){
    if(value) {
      this.alertService.success(mensaje);
    }else{
      this.alertService.danger(mensaje);
    }
  }
  async buscaFolio(){
    if(this.idFolio){
      let folio = await this.folioService.folioById(this.idFolio);
      this.folio = folio;
      await this.buscaEmpresaMandante(this.folio.libro);
      await this.buscaEmpresaContratista(this.folio.libro);
      await this.buscarListaUsuarioLibro(this.folio);
      await this.buscaFolioReferencias();
      this.buscaTipoFolio(this.folio);
      this.formContrato.controls['receptor'].setValue(this.folio.idReceptor);
      this.formContrato.controls['tipoFolio'].setValue(this.folio.configuracionTipoFolioTipoLibro.tipoFolio.nombre);
      this.formContrato.controls['asunto'].setValue(this.folio.asunto);
      this.formContrato.controls['anotacion'].setValue(this.folio.anotacion);
      if(this.folio.fechaRequerida ===  null || this.folio.fechaRequerida === undefined){
        this.solicitaRespuesta = false;
        this.formContrato.controls['solicitaRespuesta'].setValue(false);
      }else{
        this.solicitaRespuesta = true;
        let mes = new Date(this.folio.fechaRequerida).getUTCMonth() + 1 ;
        let dia = new Date(this.folio.fechaRequerida).getUTCDate();
        let anio = new Date(this.folio.fechaRequerida).getUTCFullYear();
        let fecha = {
          year : anio,
          month : mes,
          day : dia
        }
        this.formContrato.controls['fechaRequerida'].setValue(fecha);
        this.formContrato.controls['solicitaRespuesta'].setValue(true);
      }
    }else{
      let folio = JSON.parse(localStorage.getItem("datosCrearFolio"));    
      await this.buscaEmpresaMandante(folio.libro);
      await this.buscaEmpresaContratista(folio.libro);
      await this.buscarListaUsuarioLibro(folio);
      await this.buscaFolioReferencias();
      this.folio = folio;
      this.buscaTipoFolio(this.folio);
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
  volver(){
    this.router.navigate(['/sistema/resumen-de-folio/', this.folio.libro.idLibro])
  }
  async buscarListaUsuarioLibro(folio){
    this.listaUsuarioLibro = await this.usuarioLibroService.buscarUsuarioLibrosByLibro(folio.libro.idLibro);
    this.listaUsuarioLibro = this.listaUsuarioLibro.filter(x=>x.usuarioEmpresa.usuario.idUsuario !== this.empresaUsuarioRol.usuario.idUsuario);
  }

  async buscaTipoFolio(folio : Folio){
    let listaTipoFolio = await this.configuracionTipoFolioTipoLibroService.listar();
    let usuario = await this.buscaUsuarioLibro(folio);
    if(usuario.libro.contrato.idEmpresaMandante === this.empresaMandante.idEmpresa){
      listaTipoFolio = listaTipoFolio.filter(x=> x.tipoFolio.visibleMandante === true);
    }else{
      listaTipoFolio = listaTipoFolio.filter(x=> x.tipoFolio.visibleContratista === true);
    }
    this.listaTipoFolio = listaTipoFolio;
  }
  async buscaUsuarioLibro(folio : Folio){
    return  await this.usuarioLibroService.buscarUsuarioLibrosByLibroAndUsuario( folio.libro.idLibro,this.empresaUsuarioRol.usuario.idUsuario);
  }
  inicializarForm(){
    this.formContrato = this.fb.group({
      receptor : ['', Validators.required],
      tipoFolio : ['', Validators.required],
      asunto : ['', Validators.required],
      anotacion : [''],
      solicitaRespuesta : [false],
      fechaRequerida : [Date()]
    });
  }
  modalFolioReferencia(){
    const dialog = this.dialog.open(FolioReferenciaComponent, { windowClass: 'modal-xl animate' });   
    dialog.componentInstance.usuario = this.empresaUsuarioRol.usuario;
    dialog.componentInstance.folio = this.folio;
    dialog.componentInstance.modal = dialog;
    dialog.result.then((result : Folio) => {
      if(result !== undefined){
       this.setFolioReferencia(result);
      }
    });

  }
  setFolioReferencia(result){
    
    /* if(this.folioReferencias.length > 0){
      this.folioReferencias.forEach(element=>{
        if(element.idFolio !== result.idFolio){
          this.folioReferencias = [...this.folioReferencias, result];
          this.folioReferenciasNombre = [...this.folioReferenciasNombre, result.asunto];
        }
      });
    }else{
      this.folioReferencias = [...this.folioReferencias, result];
      this.folioReferenciasNombre = [...this.folioReferenciasNombre, result.asunto];
    } */
  }

  eliminarFolio(){
    const dialog = this.dialog.open(ModalConfirmarEliminacionComponent);
    dialog.result.catch(value=>{
      if(value === 1){
        this.showToast(true,"Folio eliminado Correctamente");
        this.folioService.eliminarFolioBorrador(this.folio.idFolio);
        this.router.navigate(['/sistema/resumen-de-folio/', this.folio.libro.idLibro]);
      }
    })
  }
  async previsualizarPdf(){
    
    let fechaRequeridaConstruida = "S/N";
    if( this.formContrato.controls['fechaRequerida'].value !== null ){
      let fechaRequerida = this.formContrato.controls['fechaRequerida'].value;
      fechaRequerida = this.formContrato.controls['fechaRequerida'].value.year + '-' + this.formContrato.controls['fechaRequerida'].value.month+'-'+this.formContrato.controls['fechaRequerida'].value.day;
      fechaRequeridaConstruida = this.datepipe.transform(fechaRequerida, "dd-MM-yyyy")
      this.folio.fechaRequerida = new Date(fechaRequerida);
    }
    this.folio.anotacion = this.formContrato.controls['anotacion'].value;
    let html = await this.htmlFolioFirmado(fechaRequeridaConstruida);
    this.folio.codigoVerificacion = await this.generarCodigoVerificacion(this.folio);
    let codigoVerificacion = this.folio.codigoVerificacion;
    const response = await this.folioService.previsualizarPdf(html,codigoVerificacion);
    const dialog = this.dialog.open(VisualizarPdfComponent, { windowClass: 'modal-xl animate' });
    dialog.componentInstance.html = response;
    dialog.componentInstance.folio = this.folio;
    dialog.componentInstance.usuario = this.empresaUsuarioRol.usuario;
    dialog.componentInstance.empresaMandante = this.empresaMandante;
    dialog.componentInstance.empresaContratista = this.empresaContratista;
    dialog.componentInstance.soloVisualizar = false;
    dialog.componentInstance.modal = dialog;
  }
    
  downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  async htmlFolioFirmado(fechaRequerida){
    this.folio.fechaFirma = new Date();
    let imagen1 = document.createElement("img");    
    imagen1.src = "/assets/img/letra110_31.png";
    let imagen2 = document.createElement("img");    
    imagen2.src = "/assets/img/logo42_.png";
    let qr = document.createElement("img");    
    qr.src = "/assets/img/qr.jpg";
    let usuarioMandante = await this.usuarioService.findById(this.folio.idUsuarioCreador);
    let usuarioContratista = await this.usuarioService.findById(this.folio.idReceptor);
    let fechaFirma;
    fechaFirma =  this.datepipe.transform(this.folio.fechaFirma, "dd/MM/yyyy HH:mm:ss");
    let folioRespuesta;
    let foliosReferencia = "S/N";
    if(this.folio.idFolioRespuesta === undefined){
      folioRespuesta = "S/N";
    }
    let html = `<html lang="es">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1">      
      <style>
        html, body {
          margin: 0; padding: 0;
          height: 100%;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
        }       
        ul.listado-adjuntos {                
          line-height: 15px;                
        }
        table.info {          
          line-height: 12px;
          font-size: 12px;                               
        }
        table.bloque-firma {
          padding-top: 20px;
        } 
        div.adjuntos {
          padding-top:20px;
        }
        .titulo{
          width: 100%;
          font-size: 12px; 
          background-color: #e9e9e9;
          padding-left: 5px;                
          color: #0c63a5;               
          height: 22px;
          border-bottom: 2px solid #3989c6;
          margin-top: 8px;
          margin-bottom: 10px;  
        }
      </style>
    </head>
    <body>                              
      <table style="width: 100%;">
        <tr style="padding-top: 0px;">
          <td><img style="width: 35px; height: 35px;" src="${imagen2.src}" /><img style="padding-bottom: 2px; padding-left: 3px" src="${imagen1.src}" /></td>                            
          <td style="text-align: right;">                            
            <strong style="color: #0c63a5; font-size: 17px;">Folio S/Nº</strong>
            <div style="font-size: 11px;">${fechaFirma}</div>                                    
          </td>
        </tr>
      </table>                               
      <div class="titulo">
        <div style="padding-top: 5px;">
          <strong >Información General</strong>
        </div>
      </div>
      <div>
        <table style="width: 100%;">
          <tr>
            <td>
              <table class="info">
                <tr>
                  <td style="width: 100px;"><strong>Contrato:</strong></td>
                  <td><strong>${this.folio.libro.contrato.nombre}</strong></td>
                </tr>
                <tr>
                  <td>Código:</td>
                  <td>${this.folio.libro.contrato.codigo}</td>
                </tr>
                <tr>
                  <td>Mandante:</td>
                  <td>${this.empresaMandante.razonSocial} | &nbsp;RUT: ${RutUtil.rutConPuntosConGuion(this.empresaMandante.rut)}</td>
                </tr>                            
                <tr>
                  <td>Contratista:</td>
                  <td>${this.empresaContratista.razonSocial} |  &nbsp;RUT:  ${RutUtil.rutConPuntosConGuion(this.empresaContratista.rut)}</td>
                </tr>                            
                </table>
              </td>
              <td>
                <table class="info" style="max-width: 300px; float:right;">
                  <tr>
                    <td style="width: 85px;">
                      <strong>Libro:</strong>
                    </td>
                    <td><strong>${this.folio.libro.nombre}</strong></td>
                  </tr>
                  <tr>
                    <td>Código:</td>
                    <td>${this.folio.libro.codigo}</td>
                  </tr>
                  <tr>
                    <td>Clase Libro:</td>
                    <td>${this.folio.libro.tipoLibro.descripcion}</td>
                  </tr>
                  <tr>
                    <td>Tipo Firma:</td>
                    <td>${this.folio.libro.tipoFirma.descripcion}</td>
                  </tr>
                </table>                                
              </td>
            </tr>
        </table>
        <hr>
        <table class="info">                        
          <tr>
            <td style="width: 100px;">De:</td>
            <td>${this.folio.usuarioCreador} | RUT: ${RutUtil.rutConPuntosConGuion(usuarioMandante.rut)}</td>
          </tr>                       
          <tr>
            <td>Para:</td>
            <td>${this.folio.usuarioReceptor} | RUT: ${RutUtil.rutConPuntosConGuion(usuarioContratista.rut)}</td>
          </tr>                                               
          <tr>
            <td>Respuesta de:</td>
            <!--<td>Libro Maestro | Folio Nº23</td>  -->
            <td>${folioRespuesta}</td>      
          </tr>
          <tr>
            <td>Referencia de:</td>
            <td>${foliosReferencia}</td>  
          </tr>
          <tr>
            <td>Fecha Requerida:</td>
            <td>${fechaRequerida}</td>
          </tr>
          <tr>
            <td>Tipo de Folio:</td>
            <td>Consulta</td>
          </tr>
          <tr>
            <td>Asunto:</td>
            <td>${this.folio.asunto}</td>
          </tr>
        </table>
        <div class="titulo">
          <div style="padding-top: 5px;">
            <strong >Anotación</strong>
          </div>
        </div>
        <div>
          ${this.folio.anotacion}
        </div>
        <div style="page-break-inside: avoid">
          <div class="titulo">
            <div style="padding-top: 5px;">
              <strong >Adjuntos</strong>
            </div>
          </div>
          <ul class="listado-adjuntos">
            <li>Archivo1.jpg | 3,56 MB</li>
            <li>Archivo2.doc | 12,598 MB</li>
            <li>Archivo3.xls | 6,542 KB</li>
          </ul> 
        </div>              
        <div style="page-break-inside: avoid; height: 85px; width: 100%;">
          <table style="padding-top: 20px;padding-left: 10px;">
            <tr>
              <td style="width: 75px;">
                <img style="width: 70px; height: 70px;" src="${qr.src}" />
              </td>
              <td style="font-size: 13px; width: 260px; height: 40px; font-family:'Courier New', Courier, monospace; padding-left: 0px;">
                Folio emitido por ${this.folio.usuarioCreador} el ${fechaFirma} con un certificado emitido por .............              
              </td>
            </tr>
          </table>          
          <span style="padding-left: 13px;padding-top: 5px; font-size: 11px;">Este documento es una representación visual del folio borrador por lo que no tiene validez formal.</span>      
        </div>                                       
      </div> 
    </body>
</html>`;

return html;
  }

  async generarCodigoVerificacion(folio : Folio){
    let generarCodigoVerificacion  = new GenerarCodigoVerificacionDTO();
    generarCodigoVerificacion.nombreLibro = folio.libro.nombre.toUpperCase().trim();
    generarCodigoVerificacion.nombreContrato = folio.libro.contrato.nombre.toUpperCase().trim();
    const respuesta = await this.folioService.generarCodigoVerificacion(generarCodigoVerificacion);
    return respuesta;
  }

  borrarFolioReferencia($event){
    let folio = this.folioReferencias.find(x=> x.asunto === $event);
    this.folioReferenciaDelete.push(folio);
    this.folioReferencias.splice(folio , 1);
    this.folioReferenciasNombre.splice(folio.asunto , 1);
  }

  async ingresaFolioReferencia(){
    if(this.folioReferencias.length > 0 ){
      this.folioReferencias.forEach((element)=>{
        element.idFolioOrigen = this.folio.idFolio;
        element.idFolioReferencia = element.idFolio;
        element.idLibroFolioOrigen = this.folio.libro.idLibro;
        element.asunto = this.folio.asunto;
        if(element.id === undefined){
          this.folioReferenciaService.guardarFolioReferencia(element);
        }
      });
    }
  }
  async eliminarFolioReferencia(){
    if(this.folioReferenciaDelete.length > 0 ){
      for await (let elementos of this.folioReferenciaDelete) {
        if(elementos.id !== undefined){
          this.folioReferenciaService.eliminarFolioReferencia(elementos.id); 
        }
      }
      this.folioReferenciaDelete = [];
      
      /* this.folioReferenciaDelete.forEach((element)=>{
        let folio = this.folioService.folioById(element.idFolioOrigen).then();
        this.folioReferenciaService.eliminarFolioReferencia(element.);
      }); */
    }
    this.buscaFolioReferencias();
  }
  async buscaFolioReferencias(){
    if(this.idFolio !== undefined){
      this.folioReferencias = await this.folioReferenciaService.getFolioReferenciaByFolio(this.idFolio);
    }
   /*  this.folioReferencias.forEach((element)=>{
      let folio = this.folioService.folioById(element.idFolioOrigen).then();
      console.log(folio);
      this.folioReferenciasNombre = [...this.folioReferenciasNombre, element.asunto];
    }); */
    for await (let elementos of this.folioReferencias) {
      let folio = await this.folioService.folioById(elementos.idFolioOrigen);
      this.folioReferenciasNombre = [...this.folioReferenciasNombre, folio.asunto];
    }
  }
}
