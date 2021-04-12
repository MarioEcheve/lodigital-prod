import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EstadoLibro } from '../../../model/estadoLibro';
import { TipoFirma } from '../../../model/tipoFirna';
import { TipoLibro } from '../../../model/tipoLibro';
import { EstadoLibroService } from '../../../services/estado-libro.service';
import { TipoLibroService } from '../../../services/tipo-libro.service';
import { TipoFirmaService } from '../../../services/tipo-firma.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../model/Libro';
import { Contrato } from '../../../model/Contrato';
import { ContratoService } from '../../../services/contrato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../vendor/libs/spinkit/spinkit.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class LibroComponent implements OnInit {
  listaEstadosLibro: EstadoLibro[] = [];
  listaTiposLibro: TipoLibro[] = [];
  listaTipoFirma: TipoFirma[] = [];
  formLibro: FormGroup;
  contrato: Contrato;

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


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private estadoLibroService: EstadoLibroService,
    private tipoLibroService: TipoLibroService,
    private tipoFirmaService: TipoFirmaService,
    private libroService: LibroService,
    private contratoService: ContratoService,
    private appService: AppService,
    public toastrService: ToastrService,
  ) {
    this.inicializarForm();
    this.listarEstadoLibro();
    this.listarTipoLibroService();
    this.listarTipoFirma();
    this.buscarContrato();
  }

  ngOnInit() {
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
  inicializarForm() {
    this.formLibro = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      tipoLibro: ['', Validators.required],
      tipoFirma: ['', Validators.required]
    });
  }
  async guardar() {
    let libro = new Libro();
    libro.codigo = this.formLibro.controls['codigo'].value;
    libro.descripcion = this.formLibro.controls['descripcion'].value;
    libro.nombre = this.formLibro.controls['nombre'].value;
    libro.fechaCreacion = new Date();
    libro.tipoFirma = this.listaTipoFirma.find(x => x.descripcion.toLowerCase() === this.formLibro.controls['tipoFirma'].value.toLowerCase());
    libro.tipoLibro = this.listaTiposLibro.find(x => x.descripcion.toLowerCase() === this.formLibro.controls['tipoLibro'].value.toLowerCase());
    libro.estadoLibro = this.listaEstadosLibro.find(x => x.descripcion.toLowerCase() === 'pendiente');
    libro.contrato = this.contrato;
    libro.libroAbierto = false;
    let response = await this.libroService.save(libro);
    if (response) {
      this.showToast();
      this.router.navigate(['/sistema/detalle-libro/', response.idLibro]);
    } else {

    }
  }
  cambiarTipoLibro(value) {

  }
  cambiarTipoFirma(value) {

  }
  async buscarContrato() {
    let idContrato = this.activatedRoute.snapshot.params['idContrato'];
    let response = await this.contratoService.contratoById(idContrato);
    this.contrato = response;
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
      'Libro Creado Correctamente'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

}
