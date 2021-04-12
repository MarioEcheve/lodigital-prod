import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElementRef, ViewChild } from '@angular/core';
import { Folio } from '../../../../model/folio';
import { FolioService } from '../../../../services/folio.service';
import { LibroService } from '../../../../services/libro.service';
import { Router } from '@angular/router';
import { EstadoLibroService } from '../../../../services/estado-libro.service';
import { EstadoLibro } from '../../../../model/estadoLibro';
import { Usuario } from '../../../../model/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { RutUtil } from '../../../../util/rut-util';
import { Empresa } from '../../../../model/empresa';
import { GenerarCodigoVerificacionDTO } from '../../../../DTO/GenerarCodigoVerificacionDTO';
import { DatePipe } from '@angular/common';
import { ModalFirmaCredencialesComponent } from '../../components/modal-firma-credenciales/modal-firma-credenciales.component';
import { ModalFirmaAvanzadaComponent } from '../../components/modal-firma-avanzada/modal-firma-avanzada.component';
@Component({
  selector: 'app-visualizar-pdf',
  templateUrl: './visualizar-pdf.component.html',
  styles: [],
  providers: [DatePipe]
})
export class VisualizarPdfComponent implements OnInit {
  @Input() public html;
  @Input() public folio : Folio;
  @Input() public usuario : Usuario;
  @Input() public empresaMandante : Empresa;
  @Input() public empresaContratista : Empresa;
  url : any;
  resultadoPdf = new FormControl();
  interval;
  @ViewChild('result') public result: ElementRef;
  listaEstadosLibro : EstadoLibro[]=[];
  
  constructor(private dialog : NgbModal ,
              public sanitizer: DomSanitizer,
              private folioService : FolioService,
              private libroService : LibroService,
              private router : Router,
              private estadoLibroService : EstadoLibroService,
              private usuarioService : UsuarioService,
              public datepipe: DatePipe) {
              
              this.estadosLibro();
  }
  async ngOnInit() {
    let pdf = `data:application/pdf;base64,${this.html}`; 
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(pdf);
    this.html = await this.htmlPdfFirmado();
    this.validaPdfRespuesta();
  }
  cancelar(){
    this.dialog.dismissAll();
    clearInterval(this.interval);
  }
  async validaPdfRespuesta(){
      if(this.result.nativeElement.value === ""){
      }else{
        clearInterval(this.interval);
        this.guardaPdfEnBD(this.result.nativeElement.value);
        this.downloadPDF(this.result.nativeElement.value);
      }
  }
  async firma(){
    let pdfFirma = await this.htmlPdfFirmado();
    this.html = pdfFirma;
    this.interval =  setInterval(() => {
      this.validaPdfRespuesta();
    }, 2000);
  }
  downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  async guardaPdfEnBD(pdf){
    const file = `data:application/pdf;base64,${pdf}`;
    var documento = file.split(",");
    var aux = documento[0].split("data:");
    var data = aux[1].split(";");
    this.folio.pdfFirmado = documento[1];
    this.folio.pdfFirmadoContentType = data[0];
    this.folio.idUsuarioFirma = this.usuario.idUsuario;
    let responseCorrelativo = await this.folioService.buscaCorrelativoFolio(this.folio.libro.idLibro);
    let correlativo = responseCorrelativo[0].correlativo;
    this.folio.correlativo = correlativo;
    
    const respuesta = await this.folioService.crearFolio(this.folio);
    if(respuesta !== undefined || respuesta !== null){
      if(this.folio.configuracionTipoFolioTipoLibro.tipoFolio.aperturaLibro){
        this.folio.libro.libroAbierto = true;
        this.folio.libro.estadoLibro = this.listaEstadosLibro.find(x=> x.descripcion.toLowerCase() === "abierto");
        this.libroService.save(this.folio.libro);
      }
      this.dialog.dismissAll();
      this.router.navigate(['/sistema/resumen-de-folio/', this.folio.libro.idLibro]);
    }
  }
  async estadosLibro(){
    const response = await this.estadoLibroService.listar();
    this.listaEstadosLibro = response;
  }
  async buscarCorrelativoFolio(idLibro){
    const response = await this.folioService.buscaCorrelativoFolio(idLibro);
    return response;
  }

  firma2(){
    const dialog = this.dialog.open(ModalFirmaAvanzadaComponent);     
  }
  firma1(){
    const dialog = this.dialog.open(ModalFirmaCredencialesComponent);   
  }

  async htmlPdfFirmado(){   
    let imagen1 = document.createElement("img");    
    imagen1.src = "/assets/img/letra110_31.png";
    let imagen2 = document.createElement("img");    
    imagen2.src = "/assets/img/logo42_.png";
    let usuarioMandante = await this.usuarioService.findById(this.folio.idUsuarioCreador);
    let usuarioContratista = await this.usuarioService.findById(this.folio.idReceptor);
    let data = await this.folioService.buscaCorrelativoFolio(this.folio.libro.idLibro);
    let correlativo = data[0].correlativo;
    let fechaRequerida;
    let fechaFirma;
    fechaFirma = this.datepipe.transform(this.folio.fechaFirma, "dd/MM/yyyy HH:mm:ss");
    if(this.folio.fechaRequerida === undefined){
      fechaRequerida = "S/N";
    }else{
      fechaRequerida = this.datepipe.transform(this.folio.fechaRequerida, "dd/MM/yyyy");
    }
    let folioRespuesta;
    let foliosReferencia = "S/N";
    if(this.folio.idFolioRespuesta === undefined){
      folioRespuesta = "S/N";
    }
    //this.folio.codigoVerificacion = await this.generarCodigoVerificacion(this.folio);
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
            <strong style="color: #0c63a5; font-size: 17px;">Folio Nº ${correlativo}</strong>
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
        </div>                                       
      </div> 
    </body>
    </html>`;   
    let codigoVerificacion = this.folio.codigoVerificacion;
    const response = await this.folioService.previsualizarPdf(html, codigoVerificacion);
    return response;
  }
  /* async generarCodigoVerificacion(folio : Folio){
    let generarCodigoVerificacion  = new GenerarCodigoVerificacionDTO();
    generarCodigoVerificacion.nombreLibro = folio.libro.nombre;
    generarCodigoVerificacion.nombreContrato = folio.libro.contrato.nombre;
    const respuesta = await this.folioService.generarCodigoVerificacion(generarCodigoVerificacion);
    return respuesta;
  } */

}
