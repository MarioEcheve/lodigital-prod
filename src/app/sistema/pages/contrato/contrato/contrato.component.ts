import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comuna } from '../../../model/comuna';
import { Empresa } from '../../../model/empresa';
import { Region } from '../../../model/region';
import { ComunaService } from '../../../services/comuna.service';
import { EmpresaService } from '../../../services/empresa.service';
import { RegionService } from '../../../services/region.service';
import { RutUtil } from '../../../util/rut-util';
import { rutEsValido } from '../../../../sistema/util/validar-rut';
import { EstadoContratoService } from '../../../services/estado-contrato.service';
import { EstadoContrato } from '../../../model/estadoContrato';
import { TipoContrato } from '../../../model/TipoContrato';
import { TipoModalidad } from '../../../model/tipoModalidad';
import { TipoModalidadService } from '../../../services/tipo-modalidad.service';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { ContratoService } from '../../../services/contrato.service';
import { Contrato } from '../../../model/Contrato';
import { AppService } from '../../../../app.service';
import { ToastrService } from 'ngx-toastr';
import { EstadoServicioContratoService } from '../../../services/estado-servicio-contrato.service';
import { TipoMontoContratoService } from '../../../services/tipo-monto-contrato.service';
import { TipoValorContratoService } from '../../../services/tipo-valor-contrato.service';
import { TipoMontoContrato } from '../../../model/tipoMontoContrato';
import { TipoValorContrato } from '../../../model/tipoValorContrato';
@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../vendor/libs/spinkit/spinkit.scss',
    '../../../../../vendor/libs/ng2-archwizard/ng2-archwizard.scss',
  ],
  //encapsulation : ViewEncapsulation.None
})

export class ContratoComponent implements OnInit {
  @Output() volverUsuario: EventEmitter<boolean> = new EventEmitter<boolean>()
  formContrato: FormGroup;
  formEmpresaMandante: FormGroup;
  formEmpresaContratista: FormGroup;
  formConfiguracionContrato: FormGroup;
  crearUsuario: Boolean = true;
  listaRegiones: Region[] = [];
  listaComunas: Comuna[] = [];
  listaRegionesMandante: Region[] = [];
  listaComunasMandante: Comuna[] = [];
  listaRegionesContratista: Region[] = [];
  listaComunasContratista: Comuna[] = [];
  listaTipoContrato: TipoContrato[] = [];
  listaTipoModalidad: TipoModalidad[] = [];
  listaEstadoContrato: EstadoContrato[] = [];
  listaEstadoServicioContrato: EstadoContrato[] = [];
  listaTipoMontoContrato: TipoMontoContrato[] = [];
  listaTipoValorContrato: TipoValorContrato[] = [];

  empresaInsert: Empresa = new Empresa();
  empresaInsertMandante: Empresa = new Empresa();
  empresaInsertContratista: Empresa = new Empresa();
  empresaMandante: Empresa = new Empresa();
  rutValidoMandante: Boolean;
  rutValidoContratista: Boolean;
  empresaMandanteSeleccionada: Empresa;
  empresaContratistaSeleccionada: Empresa;


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

  mostrarOtroTipoContrato = false;
  mostrarOtroModalidad = false;

  displayMonths;
  navigation;
  isRTL;
  disabled;

  constructor(private fb: FormBuilder,
    private regionService: RegionService,
    private comunaService: ComunaService,
    private empresaService: EmpresaService,
    private estadoContratoService: EstadoContratoService,
    private tipoModalidadService: TipoModalidadService,
    private tipoContratoService: TipoContratoService,
    private contratoService: ContratoService,
    private appService: AppService,
    public toastrService: ToastrService,
    private estadoServicioContrato: EstadoServicioContratoService,
    private tipoMontoContratoService: TipoMontoContratoService,
    private tipoValorContratoService: TipoValorContratoService) {

    this.inicializarFormContrato();
    this.inicializarFormEmpresaMandante();
    this.inicializarFormEmpresaContratista();
    this.inicializarFormConfiguracionContrato();
    this.listarRegiones();
    this.listarTipoMontoContrato();
    this.listarTipoValorContrato();
    this.obtenerTipoContrato();
    this.obtenerTipoDeModalidad();
    this.obtenerEstadoContrato();
    this.obtenerEstadoServicioContrato();
  }

  ngOnInit() {
    if (this.crearUsuario === false) {
      this.desabilitarFormCrearContrato();
    }

    this.formEmpresaMandante.controls['rutMandante'].valueChanges.subscribe(rut => {
      this.validarRutMandante(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRutMandante(rut);
    });

    this.formEmpresaContratista.controls['rutContratista'].valueChanges.subscribe(rut => {
      this.validarContratista(RutUtil.rutSinPuntosConGuion(rut).toLowerCase());
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
      this.verificaRutContratista(rut);
    });

    this.disabledContratista();
    this.disabledMandante();
  }
  inicializarFormContrato() {
    this.formContrato = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      direccion: ['', Validators.required],
      monto: [''],
      plazo: [''],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      otroTipo: [],
      tipoModalidad: ['', Validators.required],
      otraModalidad: [],
      fechaInicio: [],
      fechaTermino: [],
      resolucionContrato: [''],
      tipoMontoContrato: [''],
      tipoValorContrato: [''],
    });
  }
  inicializarFormEmpresaMandante() {
    this.formEmpresaMandante = this.fb.group({
      rutMandante: ['', Validators.required],
      razonSocialMandante: ['',],
      nombreFantasiaMandante: [],
      direccionMandante: [],
      regionMandante: [],
      comunaMandante: [],
      idEmpresaMandante: ['', Validators.required]
    });
  }
  inicializarFormEmpresaContratista() {
    this.formEmpresaContratista = this.fb.group({
      rutContratista: ['', Validators.required],
      razonSocialContratista: [''],
      nombreFantasiaContratista: [],
      direccionContratista: [],
      regionContratista: [],
      comunaContratista: [],
      idEmpresaContratista: ['', Validators.required]
    });
  }
  inicializarFormConfiguracionContrato() {
    this.formConfiguracionContrato = this.fb.group({
      mandanteEditarContrato: [],
      contratistaEditarContrato: [],
      mandanteCrearLibro: [],
      contratistaCrearLibro: [],
    });
  }
  desabilitarFormCrearContrato() {
    this.formContrato.controls['codigo'].disable();
    this.formContrato.controls['nombre'].disable();
    this.formContrato.controls['descripcion'].disable();
    this.formContrato.controls['monto'].disable();
  }
  listarRegiones() {
    this.regionService.regiones().subscribe(
      (response: any) => {
        this.listaRegiones = response;
        this.listaRegionesMandante = response;
        this.listaRegionesContratista = response;
      }
    );
  }
  comunas(idRegion: number) {
    this.comunaService.comunas(idRegion).subscribe(
      (response: any) => {
        this.listaComunas = response;
        this.listaComunasMandante = response;
        this.listaComunasContratista = response;
      }
    );
  }

  async obtenerEstadoServicioContrato() {
    this.listaEstadoServicioContrato = await this.estadoServicioContrato.buscarEstadoServicioContrato();
  }

  cambiarRegion(value) {
    let regionSelected = this.listaRegiones.find(x => x.nombre === value);
    this.empresaInsert.region = regionSelected;
    this.comunas(regionSelected.id);
  }
  cambiarComuna(value) {
    let comunaSelected = this.listaComunas.find(x => x.nombre === value);
    this.empresaInsert.region = comunaSelected;
  }
  cambiarRegionMandante(value) {
    let regionSelectedMandante = this.listaRegionesMandante.find(x => x.nombre === value);
    this.empresaInsertMandante.region = regionSelectedMandante;
    this.comunas(regionSelectedMandante.id);
  }
  cambiarComunaMandante(value) {
    let comunaSelectedMandante = this.listaComunasMandante.find(x => x.nombre === value);
    this.empresaInsertMandante.region = comunaSelectedMandante;
  }
  cambiarRegionContratista(value) {
    let regionSelectedContratista = this.listaRegionesContratista.find(x => x.nombre === value);
    this.empresaInsertContratista.region = regionSelectedContratista;
    this.comunas(regionSelectedContratista.id);
  }
  cambiarComunaContratista(value) {
    let comunaSelectedContratista = this.listaComunasContratista.find(x => x.nombre === value);
    this.empresaInsertContratista.region = comunaSelectedContratista;
  }

  async buscarEmpresaMandante(tipo: number) {
    // tipo 1 mandante , tipo 2 contratista
    switch (tipo) {
      case 1:
        let rutMandante = RutUtil.rutSinPuntosConGuion(this.formEmpresaMandante.controls['rutMandante'].value);
        if (rutMandante !== undefined || rutMandante !== null) {
          this.empresaService.obtenerEmpresaByRut(rutMandante).subscribe(
            empresa => {
              if (empresa !== null) {
                if (this.formEmpresaMandante.controls['rutMandante'].value !== this.formEmpresaContratista.controls['rutContratista'].value) {
                  this.setValueMandante(empresa);
                  this.empresaMandanteSeleccionada = empresa;
                } else {
                }
              } else {
                this.showToastErrorBuscarEmpresa();
              }
            }
          )
        }
        break;
      case 2:
        let rutContratista = RutUtil.rutSinPuntosConGuion(this.formEmpresaContratista.controls['rutContratista'].value);
        if (rutContratista !== undefined || rutContratista !== null) {
          this.empresaService.obtenerEmpresaByRut(rutContratista).subscribe(
            empresa => {
              if (empresa !== null) {
                if (this.formEmpresaContratista.controls['rutContratista'].value !== this.formEmpresaMandante.controls['rutMandante'].value) {
                  this.setValueContratista(empresa);
                  this.empresaContratistaSeleccionada = empresa;
                } else {

                }
              } else {
                this.showToastErrorBuscarEmpresa();
              }
            }
          )
        }
        break;
    }
  }

  cancelar() {
    this.volverUsuario.emit(false);
  }

  setValueMandante(empresa: Empresa) {
    this.formEmpresaMandante.patchValue({
      rutMandante: RutUtil.rutConPuntosConGuion(empresa.rut),
      razonSocialMandante: empresa.razonSocial,
      direccionMandante: empresa.direccion,
      nombreFantasiaMandante: empresa.nombreFantasia,
    });
    if (empresa.region !== undefined) {
      this.comunas(empresa.region.id);
      this.formContrato.patchValue({
        regionMandante: empresa.region.nombre,
        comunaMandante: empresa.comuna.nombre
      })
    }
    this.formEmpresaMandante.controls['idEmpresaMandante'].setValue(empresa.idEmpresa);
    this.disabledMandante();
  }

  setValueContratista(empresa: Empresa) {
    this.formEmpresaContratista.patchValue({
      rutContratisa: RutUtil.rutConPuntosConGuion(empresa.rut),
      razonSocialContratista: empresa.razonSocial,
      direccionContratista: empresa.direccion,
      nombreFantasiaContratista: empresa.nombreFantasia,
    });
    if (empresa.region !== undefined) {
      this.comunas(empresa.region.id);
      this.formEmpresaContratista.patchValue({
        regionContratista: empresa.region.nombre,
        comunaContratista: empresa.comuna.nombre
      })
    }
    this.formEmpresaContratista.controls['idEmpresaContratista'].setValue(empresa.idEmpresa);
    this.disabledContratista();
  }



  disabledMandante() {
    this.formEmpresaMandante.controls['razonSocialMandante'].disable();
    this.formEmpresaMandante.controls['direccionMandante'].disable();
    this.formEmpresaMandante.controls['nombreFantasiaMandante'].disable();
    this.formEmpresaMandante.controls['regionMandante'].disable();
    this.formEmpresaMandante.controls['comunaMandante'].disable();

  }

  disabledContratista() {
    this.formEmpresaContratista.controls['razonSocialContratista'].disable();
    this.formEmpresaContratista.controls['direccionContratista'].disable();
    this.formEmpresaContratista.controls['nombreFantasiaContratista'].disable();
    this.formEmpresaContratista.controls['regionContratista'].disable();
    this.formEmpresaContratista.controls['comunaContratista'].disable();
  }

  private verificaRutMandante(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.formEmpresaMandante.controls['rutMandante'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    } else {
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.formEmpresaMandante.controls['rutMandante'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        } else {
          this.formEmpresaMandante.controls['rutMandante'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      } else {
        this.formEmpresaMandante.controls['rutMandante'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }

  private verificaRutContratista(rut: any) {
    if (/^[\d]+[kK]?$/g.test(rut)) {
      if (rut.length >= 8) {
        this.formEmpresaContratista.controls['rutContratista'].setValue(RutUtil.rutConPuntosConGuion(rut), { emitEvent: false });
      }
    } else {
      if (rut.length >= 8) {
        if (/^[\d]+[kK]?$/g.test(rut)) {
          this.formEmpresaContratista.controls['rutContratista'].setValue(RutUtil.rutConPuntosConGuion(rut.replace(/\D+/g, "")), { emitEvent: false });
        } else {
          this.formEmpresaContratista.controls['rutContratista'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
        }
      } else {
        this.formEmpresaContratista.controls['rutContratista'].setValue(rut.replace(/\D+/g, ""), { emitEvent: false });
      }
    }
  }
  validarRutMandante(rut) {
    this.rutValidoMandante = rutEsValido(rut);
  }

  validarContratista(rut) {
    this.rutValidoContratista = rutEsValido(rut);
  }
  validaUsuarioBlurf() {
    if (this.rutValidoMandante) {
    } else {
      this.formEmpresaMandante.controls['rutMandante'].setValue('');
      this.formEmpresaMandante.controls['razonSocialMandante'].setValue('');
      this.formEmpresaMandante.controls['direccionMandante'].setValue('');
      this.formEmpresaMandante.controls['nombreFantasiaMandante'].setValue('');
      this.formEmpresaMandante.controls['regionMandante'].setValue('');
      this.formEmpresaMandante.controls['comunaMandante'].setValue('');
      this.formEmpresaMandante.controls['idEmpresaMandante'].setValue('');

    }
  }
  validaUsuarioBlurfContratista() {
    if (this.rutValidoContratista) {

    } else {
      this.formEmpresaContratista.controls['rutContratista'].setValue('');
      this.formEmpresaContratista.controls['razonSocialContratista'].setValue('');
      this.formEmpresaContratista.controls['direccionContratista'].setValue('');
      this.formEmpresaContratista.controls['nombreFantasiaContratista'].setValue('');
      this.formEmpresaContratista.controls['regionContratista'].setValue('');
      this.formEmpresaContratista.controls['comunaContratista'].setValue('');
      this.formEmpresaContratista.controls['idEmpresaContratista'].setValue('');
    }
  }
  async obtenerTipoContrato() {
    let response = await this.tipoContratoService.tiposDeContratos();
    this.listaTipoContrato = response;
  }
  async obtenerTipoDeModalidad() {
    let response = await this.tipoModalidadService.tiposDeModalidad();
    this.listaTipoModalidad = response;
  }
  async obtenerEstadoContrato() {
    let response = await this.estadoContratoService.estadosContrato();
    this.listaEstadoContrato = response;
  }

  async guardarContrato() {
    let contrato = new Contrato();
    contrato.codigo = this.formContrato.controls['codigo'].value;
    contrato.nombre = this.formContrato.controls['nombre'].value;
    contrato.direccion = this.formContrato.controls['direccion'].value;
    contrato.descripcion = this.formContrato.controls['descripcion'].value;
    contrato.region = this.listaRegiones.find(x => x.nombre === this.formContrato.controls['region'].value);
    contrato.comuna = this.listaComunas.find(x => x.nombre === this.formContrato.controls['comuna'].value);
    contrato.tipoContrato = this.listaTipoContrato.find(x => x.descripcion === this.formContrato.controls['tipoContrato'].value);
    contrato.tipoModalidad = this.listaTipoModalidad.find(x => x.descripcion === this.formContrato.controls['tipoModalidad'].value);
    contrato.tipoMontoContrato = this.listaTipoMontoContrato.find(x => x.descripcion === this.formContrato.controls['tipoMontoContrato'].value);
    contrato.tipoValorContrato = this.listaTipoValorContrato.find(x => x.descripcion === this.formContrato.controls['tipoValorContrato'].value);
    contrato.plazo = this.formContrato.controls['plazo'].value;
    contrato.estadoServicioContrato = this.listaEstadoServicioContrato.find(x => x.descripcion.toLowerCase() === 'pendiente');
    contrato.otroTipo = this.formContrato.controls['otroTipo'].value;
    contrato.otraModalidad = this.formContrato.controls['otraModalidad'].value;
    contrato.monto = this.formContrato.controls['monto'].value;
    contrato.resolucionContrato = this.formContrato.controls['resolucionContrato'].value;

    if (this.formContrato.controls['fechaInicio'].value !== null || this.formContrato.controls['fechaInicio'].value !== "null") {
      contrato.fechaInicio = null;
    }
    else {
      let diaInicio = this.formContrato.controls['fechaInicio'].value.day;
      let mesInicio = this.formContrato.controls['fechaInicio'].value.month;
      let anioInicio = this.formContrato.controls['fechaInicio'].value.year;
      contrato.fechaInicio = new Date(anioInicio, mesInicio - 1, diaInicio);
    }
    if (this.formContrato.controls['fechaTermino'].value === null) {
      contrato.fechaTermino = null;

    } else {
      let diaTermino = this.formContrato.controls['fechaTermino'].value.day;
      let mesTermino = this.formContrato.controls['fechaTermino'].value.month;
      let anioTermino = this.formContrato.controls['fechaTermino'].value.year;
      contrato.fechaTermino = new Date(anioTermino, mesTermino - 1, diaTermino);

    }

    contrato.idEmpresaMandante = this.empresaMandanteSeleccionada.idEmpresa;
    contrato.idEmpresaContratista = this.empresaContratistaSeleccionada.idEmpresa;
    contrato.nombreEmpresaMandante = `${this.empresaMandanteSeleccionada.razonSocial}`;
    contrato.nombreEmpresaContratista = `${this.empresaContratistaSeleccionada.razonSocial}`;

    contrato.mandanteEditarContrato = this.formConfiguracionContrato.controls['mandanteEditarContrato'].value;
    contrato.contratistaEditarContrato = this.formConfiguracionContrato.controls['contratistaEditarContrato'].value;
    contrato.mandanteCrearLibro = this.formConfiguracionContrato.controls['mandanteCrearLibro'].value;
    contrato.contratistaCrearLibro = this.formConfiguracionContrato.controls['contratistaCrearLibro'].value;

    let response = await this.contratoService.save(contrato);

    if (response.id !== null) {
      this.showToast();
      setTimeout(() => {
        this.cancelar();
      }, 1000);
    } else {
      this.showToastError();
    }
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
      'Contrato Creado Correctamente'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

  showToastError() {
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

    this.toastrService[this.type](this.message || this.getMessageError(), this.title, options);
  }

  getMessageError() {
    const msgs = [
      'Error al  crear el contrato'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

  showToastErrorBuscarEmpresa() {
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

    this.toastrService[this.type](this.message || this.getMessageErrorBuscarEmpresa(), this.title, options);
  }

  getMessageErrorBuscarEmpresa() {
    const msgs = [
      'Entidad no encontrada'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }


  cambiarTipoContratoAction(event: string) {
    if (event.toLowerCase() === 'otro') {
      this.mostrarOtroTipoContrato = true;
    } else {
      this.mostrarOtroTipoContrato = false;
    }
  }
  cambiarTipoModalidadAction(event: string) {
    if (event.toLowerCase() === 'otro') {
      this.mostrarOtroModalidad = true;
    } else {
      this.mostrarOtroModalidad = false;
    }
  }
  async listarTipoMontoContrato() {
    let response = await this.tipoMontoContratoService.listar();
    this.listaTipoMontoContrato = response;
  }
  async listarTipoValorContrato() {
    let response = await this.tipoValorContratoService.listar();
    this.listaTipoValorContrato = response;
  }
  cambiarTipoMontoContratoAction(value) {

  }
  cambiarTipoValorContratoAction(value) {

  }
}
