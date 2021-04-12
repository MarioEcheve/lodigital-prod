import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { Empresa } from '../../../model/empresa';
import { Folio } from '../../../model/folio';
import { Libro } from '../../../model/Libro';
import { UsuarioLibro } from '../../../model/usuarioLibro';
import { EmpresaService } from '../../../services/empresa.service';
import { FolioService } from '../../../services/folio.service';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
import { RutUtil } from '../../../util/rut-util';

@Component({
  selector: 'app-folio-firmado',
  templateUrl: './folio-firmado.component.html',
  styleUrls: ['./folio-firmado.component.scss',]
})
export class FolioFirmadoComponent implements OnInit {
  folio : Folio;
  empresaMandante : Empresa;
  empresaContratista : Empresa;
  usuarioEmisor : UsuarioLibro;
  usuarioReceptor : UsuarioLibro;
  formAnotacion : FormGroup;
  editorDisabled = true;
  config = {
    airMode: true,
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

  constructor(private alertService: AlertService,
              private activatedRoute : ActivatedRoute,
              private folioService : FolioService,
              private router : Router,
              private empresaService : EmpresaService,
              private usuarioLibroService : UsuarioLibroService,
              private fb : FormBuilder) {
    this.inicializarFormAnotacion();
  }

  ngOnInit() {
    this.buscaFolio();
  }

  showAlerts(): void{
        this.alertService.info('this is an info alert');
        this.alertService.danger('this is a danger alert');
        this.alertService.success('this is a success alert');
        this.alertService.warning('this is a warning alert');
  }
  async buscaFolio(){
    let idFolio = this.activatedRoute.snapshot.params["idFolio"];
    this.folio = await this.folioService.folioById(idFolio);

    this.formAnotacion.controls['anotacion'].setValue(this.folio.anotacion);

    this.buscaEmpresaMandante(this.folio.libro);
    this.buscaEmpresaContratista(this.folio.libro);
    this.usuarioEmisor = await this.buscaUsuarioLibroEmisor(this.folio);
    this.usuarioReceptor = await this.buscaUsuarioLibroReceptor(this.folio);
    this.usuarioEmisor.usuarioEmpresa.usuario.rut = RutUtil.rutConPuntosConGuion(this.usuarioEmisor.usuarioEmpresa.usuario.rut);
    this.usuarioReceptor.usuarioEmpresa.usuario.rut = RutUtil.rutConPuntosConGuion(this.usuarioReceptor.usuarioEmpresa.usuario.rut);
  }
  resumenDeFolio(){
    this.router.navigate(['/sistema/resumen-de-folio/', this.folio.libro.idLibro])
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
  async buscaUsuarioLibroEmisor(folio : Folio){
    return  await this.usuarioLibroService.buscarUsuarioLibrosByLibroAndUsuario( folio.libro.idLibro, folio.idUsuarioFirma);
  }
  async buscaUsuarioLibroReceptor(folio : Folio){
    return  await this.usuarioLibroService.buscarUsuarioLibrosByLibroAndUsuario( folio.libro.idLibro, folio.idReceptor);
  }
  inicializarFormAnotacion(){
    this.formAnotacion = this.fb.group({
      anotacion : []
    });
    this.formAnotacion.controls['anotacion'].disable();
  }
}
