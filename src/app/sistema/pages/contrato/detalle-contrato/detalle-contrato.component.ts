import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../app.service';
import { Comuna } from '../../../model/comuna';
import { Contrato } from '../../../model/Contrato';
import { Empresa } from '../../../model/empresa';
import { EstadoContrato } from '../../../model/estadoContrato';
import { Libro } from '../../../model/Libro';
import { Region } from '../../../model/region';
import { TipoContrato } from '../../../model/TipoContrato';
import { TipoModalidad } from '../../../model/tipoModalidad';
import { TipoMontoContrato } from '../../../model/tipoMontoContrato';
import { TipoValorContrato } from '../../../model/tipoValorContrato';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { ComunaService } from '../../../services/comuna.service';
import { ContratoService } from '../../../services/contrato.service';
import { EmpresaService } from '../../../services/empresa.service';
import { EncryptService } from '../../../services/encrypt.service';
import { EstadoContratoService } from '../../../services/estado-contrato.service';
import { EstadoServicioContratoService } from '../../../services/estado-servicio-contrato.service';
import { LibroService } from '../../../services/libro.service';
import { RegionService } from '../../../services/region.service';
import { TipoContratoService } from '../../../services/tipo-contrato.service';
import { TipoModalidadService } from '../../../services/tipo-modalidad.service';
import { TipoMontoContratoService } from '../../../services/tipo-monto-contrato.service';
import { TipoValorContratoService } from '../../../services/tipo-valor-contrato.service';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
import { RutUtil } from '../../../util/rut-util';

@Component({
  selector: 'app-detalle-contrato',
  templateUrl: './detalle-contrato.component.html',
  styleUrls: [
    '../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss',
    '../../../../../vendor/libs/spinkit/spinkit.scss',   
  ],
  encapsulation : ViewEncapsulation.None
})
export class DetalleContratoComponent implements OnInit {
  @Output() volverUsuarioDetalleContrato: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() contrato: Contrato;
  formContrato : FormGroup;
  listaRegiones : Region[] = [];
  listaComunas : Comuna[] = [];
  listaRegionesMandante : Region[] = [];
  listaComunasMandante : Comuna[] = [];
  listaRegionesContratista : Region[] = [];
  listaComunasContratista : Comuna[] = [];
  listaTipoContrato : TipoContrato [] = [];
  listaTipoModalidad : TipoModalidad [] = [];
  listaEstadoContrato : EstadoContrato[] = [];
  listaEstadoServicioContrato : EstadoContrato[] = [];
  listaLibrosContrato : Libro[] = [];

  empresaInsert : Empresa = new Empresa();
  empresaInsertMandante : Empresa = new Empresa();
  empresaInsertContratista : Empresa = new Empresa();
  empresaMandante : Empresa = new Empresa();

  mostrarOtroTipoContrato = false;
  mostrarOtroModalidad = false;
  empresaMandanteSeleccionada : Empresa;
  empresaContratistaSeleccionada : Empresa;

  // bandera para editar el contrato
  editarContrato : Boolean = false;

  listaTipoMontoContrato : TipoMontoContrato[] = [];
  listaTipoValorContrato : TipoValorContrato[] = [];

  empresaActual : Empresa;
  empresaUsuarioRol : UsuarioEmpresa;


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

  constructor(private fb : FormBuilder,
              private router : Router, 
              private regionService : RegionService,
              private comunaService : ComunaService,
              private empresaService : EmpresaService,
              private tipoContratoService : TipoContratoService,
              private tipoModalidadService : TipoModalidadService,
              private estadoContratoService : EstadoContratoService,
              private contratoService : ContratoService,
              private estadoServicioContratoService : EstadoServicioContratoService,
              private appService: AppService, 
              public toastrService: ToastrService,
              private tipoMontoContratoService : TipoMontoContratoService,
              private tipoValorContratoService : TipoValorContratoService,
              private libroService : LibroService,
              private usuarioLibroService : UsuarioLibroService,
              private encryptService : EncryptService) { 
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.inicializarForm();
    this.listarRegiones();
    this.obtenerTipoContrato();
    this.obtenerTipoDeModalidad();
    this.obtenerEstadoContrato();
    this.listarTipoMontoContrato();
    this.listarTipoValorContrato();

  }

  ngOnInit() {
    this.setValuesFormContrato(this.contrato);
    this.libroByContrato(this.contrato.id);
    this.buscaLibrosUsuarioLibro();

  }
  cancelar(){
    this.volverUsuarioDetalleContrato.emit(false);
  }
  inicializarForm(){
    this.formContrato = this.fb.group({
      codigo : [''],
      nombre : [''],
      descripcion : [''],
      direccion : [''],
      region : [''],
      comuna : [''],
      monto : ['', Validators.required],
      tipoContrato : [],
      otroTipo: [],
      tipoModalidad : [],
      otraModalidad : [],
      fechaInicio : [''],
      fechaTermino : [''],
      rutMandante : [],
      razonSocialMandante : [],
      nombreFantasiaMandante : [],
      nombreFantasiaContratista :[],
      direccionMandante : [],
      regionMandante : [],
      comunaMandante : [],
      rutContratista : [],
      razonSocialContratista : [],
      direccionContratista : [],
      regionContratista : [],
      comunaContratista : [],
      mandanteEditarContrato : [],
      contratistaEditarContrato : [],
      mandanteCrearLibro : [],
      contratistaCrearLibro : [],
      tipoMontoContrato : [''],
      tipoValorContrato : [''],
      plazo : ['']
    });
  }
  async setValuesFormContrato(contrato : Contrato){

    this.comunas(contrato.region.id);
    let empresaMandante = await this.buscarEmpresa(contrato.idEmpresaMandante);
    let empresaContratista = await this.buscarEmpresa(contrato.idEmpresaContratista);
    this.empresaMandanteSeleccionada = empresaMandante;
    this.empresaContratistaSeleccionada = empresaContratista;

    this.formContrato.patchValue({
      idContrato : contrato.id,
      codigo : contrato.codigo,
      nombre : contrato.nombre,
      descripcion : contrato.descripcion,
      direccion : contrato.direccion,
      tipoContrato : contrato.tipoContrato.descripcion,
      tipoModalidad : contrato.tipoModalidad.descripcion,
      fechaInicio : contrato.fechaInicio,
      fechaTermino : contrato.fechaTermino,
      rutMandante : RutUtil.rutConPuntosConGuion(empresaMandante.rut),
      razonSocialMandante : empresaMandante.razonSocial,
      nombreFantasiaMandante : empresaMandante.nombreFantasia,
      direccionMandante : empresaMandante.direccion,
      rutContratista : RutUtil.rutConPuntosConGuion(empresaContratista.rut),
      razonSocialContratista : empresaContratista.razonSocial,
      direccionContratista : empresaContratista.direccion,
      mandanteEditarContrato : contrato.mandanteEditarContrato,
      contratistaEditarContrato : contrato.contratistaEditarContrato,
      mandanteCrearLibro : contrato.mandanteCrearLibro,
      contratistaCrearLibro : contrato.contratistaCrearLibro,
      monto : contrato.monto,
     
      plazo : contrato.plazo

    });
    if(empresaMandante.region !== undefined || empresaMandante.comuna !== undefined){
      this.formContrato.patchValue({
        regionMandante : empresaMandante.region.nombre,
        comunaMandante : empresaMandante.comuna.nombre,
      })
    }
    if(contrato.region !== undefined || contrato.comuna !== undefined){
      this.formContrato.patchValue({
        region : contrato.region.nombre,
        comuna : contrato.comuna.nombre,
      })
    }
    if(contrato.tipoMontoContrato !== undefined ){
      this.formContrato.patchValue({
        tipoMontoContrato : contrato.tipoMontoContrato.descripcion,
      });
    }
    if(contrato.tipoValorContrato !== undefined ){
      this.formContrato.patchValue({
        tipoValorContrato : contrato.tipoValorContrato.descripcion,
      })
    }
    if(empresaContratista.region !== undefined || empresaContratista.comuna !== undefined){
      this.formContrato.patchValue({
        regionContratista : empresaContratista.region.nombre,
        comunaContratista : empresaContratista.comuna.nombre
      })
    }

    if(contrato.tipoContrato.descripcion.toLowerCase() === 'otro'){
      this.mostrarOtroTipoContrato = true;
      this.formContrato.controls['otroTipo'].setValue(contrato.otroTipo);
    }
    if(contrato.tipoModalidad.descripcion.toLowerCase() === 'otro'){
      this.mostrarOtroModalidad = true;
      this.formContrato.controls['otraModalidad'].setValue(contrato.otraModalidad);
    }

    this.disabledMandante();
    this.disabledContratista();
    this.disabledContrato();
  }

  listarRegiones(){
    this.regionService.regiones().subscribe(
      (response : any)=>{
        this.listaRegiones = response;
        this.listaRegionesMandante = response;
        this.listaRegionesContratista = response;
      }
    );
  }
  comunas(idRegion : number){
    this.comunaService.comunas(idRegion).subscribe(
      (response : any )=>{
        this.listaComunas = response;
        this.listaComunasMandante = response;
        this.listaComunasContratista = response;
      }
    );
  }
  cambiarRegion(value){
    let regionSelected = this.listaRegiones.find(x=> x.nombre === value);
    this.empresaInsert.region = regionSelected;
    this.comunas(regionSelected.id);
  }
  cambiarComuna(value){
    let comunaSelected = this.listaComunas.find(x=> x.nombre === value);
    this.empresaInsert.region = comunaSelected;
  }
  cambiarRegionMandante(value){
    let regionSelectedMandante = this.listaRegionesMandante.find(x=> x.nombre === value);
    this.empresaInsertMandante.region = regionSelectedMandante;
    this.comunas(regionSelectedMandante.id);
  }

  cambiarComunaMandante(value){
    let comunaSelectedMandante = this.listaComunasMandante.find(x=> x.nombre === value);
    this.empresaInsertMandante.region = comunaSelectedMandante;
  }
  cambiarRegionContratista(value){
    let regionSelectedContratista = this.listaRegionesContratista.find(x=> x.nombre === value);
    this.empresaInsertContratista.region = regionSelectedContratista;
    this.comunas(regionSelectedContratista.id);
  }
  cambiarComunaContratista(value){
    let comunaSelectedContratista = this.listaComunasContratista.find(x=> x.nombre === value);
    this.empresaInsertContratista.region = comunaSelectedContratista;
  }
  async buscarEmpresa(idEmpresa : number){
    return await this.empresaService.obtenerEmpresaById(idEmpresa);
  }
  async obtenerTipoContrato(){
    let response = await this.tipoContratoService.tiposDeContratos();
    this.listaTipoContrato = response;
  }
  async obtenerTipoDeModalidad(){
    let response = await this.tipoModalidadService.tiposDeModalidad();
    this.listaTipoModalidad = response;
  }
  async obtenerEstadoContrato(){
    let response = await this.estadoContratoService.estadosContrato();
    this.listaEstadoContrato = response;
  }
  async obtenerEstadoServicioContrato(){
    let response = await this.estadoServicioContratoService.buscarEstadoServicioContrato();
    this.listaEstadoServicioContrato = response;
  }
  cambiarTipoContratoAction(event : string){
    console.log(event);
    if(event.toLowerCase() ==='otro'){
      this.mostrarOtroTipoContrato = true;
    }else{
      this.mostrarOtroTipoContrato = false;
      this.formContrato.controls['otroTipo'].setValue('');
    }
  }
  cambiarTipoModalidadAction(event : string){
    console.log(event);
    if(event.toLowerCase() ==='otro'){
      this.mostrarOtroModalidad = true;
    }else{
      this.mostrarOtroModalidad = false;
      this.formContrato.controls['otraModalidad '].setValue('');
    }
  }
  disabledMandante(){
    this.formContrato.controls['razonSocialMandante'].disable();
    this.formContrato.controls['direccionMandante'].disable();
    this.formContrato.controls['nombreFantasiaMandante'].disable();
    this.formContrato.controls['regionMandante'].disable();
    this.formContrato.controls['comunaMandante'].disable();
  }
  enabledMandante(){
    //this.formContrato.controls['rutMandante'].enable();
  }
  disabledContratista(){
    this.formContrato.controls['razonSocialContratista'].disable();
    this.formContrato.controls['direccionContratista'].disable();
    this.formContrato.controls['nombreFantasiaContratista'].disable();
    this.formContrato.controls['regionContratista'].disable();
    this.formContrato.controls['comunaContratista'].disable();
    this.formContrato.controls['rutContratista'].disable();
    this.formContrato.controls['otroTipo'].disable();
  }
  enabledContratista(){
    //this.formContrato.controls['rutContratista'].enable();
  }
  disabledContrato(){
    this.formContrato.controls['descripcion'].disable();
    this.formContrato.controls['direccion'].disable();
    this.formContrato.controls['region'].disable();
    this.formContrato.controls['comuna'].disable();
    this.formContrato.controls['tipoContrato'].disable();
    this.formContrato.controls['tipoModalidad'].disable();
    this.formContrato.controls['fechaInicio'].disable();
    this.formContrato.controls['otraModalidad'].disable();
    this.formContrato.controls['monto'].disable();
    this.formContrato.controls['plazo'].disable();
    this.formContrato.controls['tipoMontoContrato'].disable();
    this.formContrato.controls['tipoValorContrato'].disable();


  }
  enabledContrato(){
    this.formContrato.controls['descripcion'].enable();
    this.formContrato.controls['direccion'].enable();
    this.formContrato.controls['region'].enable();
    this.formContrato.controls['comuna'].enable();
    this.formContrato.controls['tipoContrato'].enable();
    this.formContrato.controls['tipoModalidad'].enable();
    this.formContrato.controls['fechaInicio'].enable();
    this.formContrato.controls['otraModalidad'].enable();
    this.formContrato.controls['otroTipo'].enable();
    this.formContrato.controls['monto'].enable();
    this.formContrato.controls['plazo'].enable();
    this.formContrato.controls['tipoMontoContrato'].enable();
    this.formContrato.controls['tipoValorContrato'].enable();
  }
  async guardar(){
    this.editarContrato = false;
    this.contrato.codigo = this.formContrato.controls['codigo'].value;
    this.contrato.nombre = this.formContrato.controls['nombre'].value;
    this.contrato.direccion = this.formContrato.controls['direccion'].value;
    this.contrato.descripcion = this.formContrato.controls['descripcion'].value;

    this.contrato.region = this.listaRegiones.find(x=> x.nombre === this.formContrato.controls['region'].value);
    this.contrato.comuna = this.listaComunas.find(x=> x.nombre === this.formContrato.controls['comuna'].value);
    this.contrato.tipoContrato = this.listaTipoContrato.find(x=> x.descripcion === this.formContrato.controls['tipoContrato'].value);
    this.contrato.tipoModalidad = this.listaTipoModalidad.find(x=> x.descripcion === this.formContrato.controls['tipoModalidad'].value);
    this.contrato.otroTipo = this.formContrato.controls['otroTipo'].value;
    this.contrato.otraModalidad = this.formContrato.controls['otraModalidad'].value;
    this.contrato.monto = this.formContrato.controls['monto'].value;
    this.contrato.plazo = this.formContrato.controls['plazo'].value;
    this.contrato.tipoMontoContrato = this.listaTipoMontoContrato.find(x=> x.descripcion === this.formContrato.controls['tipoMontoContrato'].value);
    this.contrato.tipoValorContrato = this.listaTipoValorContrato.find(x=> x.descripcion === this.formContrato.controls['tipoValorContrato'].value);

    this.contrato.idEmpresaMandante = this.empresaMandanteSeleccionada.idEmpresa;
    this.contrato.idEmpresaContratista = this.empresaContratistaSeleccionada.idEmpresa; 
    
    this.contrato.idEmpresaMandante = this.empresaMandanteSeleccionada.idEmpresa;
    this.contrato.idEmpresaContratista = this.empresaContratistaSeleccionada.idEmpresa; 

    let response = await this.contratoService.save(this.contrato);
    if(response !== undefined){
      this.showToast();
        this.cancelar();
    }else{
      this.showToastError();
    }

  }
  async guardarPermisos(){
    this.contrato.mandanteEditarContrato = this.formContrato.controls['mandanteEditarContrato'].value;
    this.contrato.contratistaEditarContrato = this.formContrato.controls['contratistaEditarContrato'].value;
    this.contrato.mandanteCrearLibro = this.formContrato.controls['mandanteCrearLibro'].value;
    this.contrato.contratistaCrearLibro = this.formContrato.controls['contratistaCrearLibro'].value;

    let response = await this.contratoService.save(this.contrato);
    this.contrato = response;
    
    if(response !== undefined){
      this.showToast();
        //this.cancelar();
    }else{
      this.showToastError();
    }

  }
  editar(){
    this.editarContrato = true;
    this.enabledContrato();
    this.enabledContratista();
    this.enabledMandante();
  }
  async buscarEmpresaMandante(tipo : number){
    // tipo 1 mandante , tipo 2 contratista
    switch(tipo) {
      case 1 : 
        let rutMandante = RutUtil.rutSinPuntosConGuion(this.formContrato.controls['rutMandante'].value);
        if(rutMandante !== undefined || rutMandante !== null){
          this.empresaService.obtenerEmpresaByRut(rutMandante).subscribe(
            empresa=>{
              if(empresa !== null){
                if(this.formContrato.controls['rutMandante'].value !== this.formContrato.controls['rutContratista'].value){
                  this.setValueMandante(empresa);
                  this.empresaMandanteSeleccionada = empresa;
                }else{
                  console.log("error mandante")
                }
              }
            }
          )
        }
        break;
      case 2 : 
        let rutContratista = RutUtil.rutSinPuntosConGuion(this.formContrato.controls['rutContratista'].value);
        if(rutContratista !== undefined || rutContratista !== null){
          this.empresaService.obtenerEmpresaByRut(rutContratista).subscribe(
            empresa=>{
              if(empresa !== null){
                if(this.formContrato.controls['rutContratista'].value !== this.formContrato.controls['rutMandante'].value){
                  this.setValueContratista(empresa);
                  this.empresaContratistaSeleccionada = empresa;
                }else{
                  
                }
              }
            }
          )
        }
        break;
    } 
  }
  setValueContratista(empresa : Empresa){
    this.formContrato.patchValue({
      rutContratisa : RutUtil.rutConPuntosConGuion(empresa.rut),
      razonSocialContratista : empresa.razonSocial,
      direccionContratista: empresa.direccion,
      nombreFantasiaContratista : empresa.nombreFantasia,
    });
    if(empresa.region !== undefined){
      this.comunas(empresa.region.id);
      this.formContrato.patchValue({
        regionContratista : empresa.region.nombre,
        comunaContratista : empresa.comuna.nombre
      })
    }
    this.disabledContratista();
  }
  setValueMandante(empresa : Empresa){
    this.formContrato.patchValue({
      rutMandante : RutUtil.rutConPuntosConGuion(empresa.rut),
      razonSocialMandante : empresa.razonSocial,
      direccionMandante : empresa.direccion,
      nombreFantasiaMandante : empresa.nombreFantasia,
    });
    if(empresa.region !== undefined){
      this.comunas(empresa.region.id);
      this.formContrato.patchValue({
        regionMandante : empresa.region.nombre,
        comunaMandante : empresa.comuna.nombre
      })
    }
    this.disabledMandante();
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
      'Contrato Editado Correctamente'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

  showToastError(){
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
      'Error al Editar el contrato'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

  async listarTipoMontoContrato(){
    let response = await this.tipoMontoContratoService.listar();
    this.listaTipoMontoContrato = response;
  }
  async listarTipoValorContrato(){
    let response = await this.tipoValorContratoService.listar();
    this.listaTipoValorContrato = response;
  }
  cambiarTipoMontoContratoAction(value){

  }
  cambiarTipoValorContratoAction(value){

  }
  async libroByContrato(idContrato){
    let response = await this.libroService.librosByContrato(idContrato);
    this.listaLibrosContrato = response;
  }
  nuevoLibro(){
    this.router.navigate(['/sistema/nuevo-libro/', this.contrato.id]);
  }
  editarLibro(idLibro){
    this.router.navigate(['/sistema/detalle-libro/', idLibro]);
  }
  resumenFolio(idLibro){
    this.router.navigate(['/sistema/resumen-de-folio/', idLibro])
  }
  
  async buscaLibrosUsuarioLibro(){
    let response = await this.usuarioLibroService.buscarUsuarioLibrosByUsuario(this.empresaUsuarioRol.usuario.idUsuario,this.contrato.id);
    await this.librosUsuarioNormal(response);
  }

  async librosUsuarioNormal(libros){
    for await(let elemento of libros){
      for await (let elemento2 of this.listaLibrosContrato){
       if(elemento.libro.idLibro === elemento2.idLibro){
        elemento2.accesoLibro = true;
       }
      }
    }
  }
}
