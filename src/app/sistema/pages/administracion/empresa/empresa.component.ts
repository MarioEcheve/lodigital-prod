import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../app.service';
import { Comuna } from '../../../model/comuna';
import { Empresa } from '../../../model/empresa';
import { Region } from '../../../model/region';
import { ComunaService } from '../../../services/comuna.service';
import { EmpresaService } from '../../../services/empresa.service';
import { EncryptService } from '../../../services/encrypt.service';
import { RegionService } from '../../../services/region.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['../../../../../vendor/libs/ngx-toastr/ngx-toastr.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmpresaComponent implements OnInit {
  empresaActual : any;
  empresaFormGroup : FormGroup;
  editar = true;
  listaRegiones : Region[] = [];
  listaComunas : Comuna[] = [];
  empresaUsuarioRol : any;
  empresaInsert : Empresa = new Empresa();
  //
  // ngx-toastr
  //

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

  constructor(private encryptService : EncryptService,
              private fb : FormBuilder,
              private regionService : RegionService,
              private comunaService : ComunaService,
              private empresaService : EmpresaService,
              private appService: AppService, 
              public toastrService: ToastrService) { 
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    console.log(this.empresaActual);
  }

  ngOnInit() {
    this.inicializarEmpresaFormGroup();
    this.desHabilitarEmpresaFormGroup();
    this.setValuesEmpresaFormGroup();
    this.listarRegiones();
  }
  inicializarEmpresaFormGroup(){
    this.empresaFormGroup = this.fb.group({
      idEmpresa : [''],
      rut : [''],
      razonSocial : [''],
      nombreFantasia : [''],
      direccion : [''],
      giroPrincipal : [''],
      nombreContactoComercial : [''],
      cargoFuncionContactoComercial : [''],
      emailContactoComercial : [''],
      telefonoPrincipalContactoComercial : [''],
      telefonoSecundarioContactoComercial : [''],
      nombreContactoTecnico : [''],
      cargoFuncionContactoTecnico : [''],
      emailContactoTecnico : [''],
      telefonoPrincipalContactoTecnico : [''],
      telefonoSecundarioContactoTecnico : [''],
      region : [''],
      comuna :['']
    });
  }
  cambioEditar(value){
    if(value === false){
      this.habilitarEmpresaFormGroup();
      this.editar = false;
      //console.log(this.empresaFormGroup.value);


    }else{
      console.log(this.empresaFormGroup.value);
      this.actualizaEmpresa(this.empresaFormGroup.value);
      this.desHabilitarEmpresaFormGroup();
      this.editar = true;
      //this.actualizaEmpresa(this.empresaFormGroup.value);
    }
  }
  habilitarEmpresaFormGroup(){
    this.empresaFormGroup.controls['nombreFantasia'].enable();
    this.empresaFormGroup.controls['direccion'].enable();
    this.empresaFormGroup.controls['giroPrincipal'].enable();
    this.empresaFormGroup.controls['nombreContactoComercial'].enable();
    this.empresaFormGroup.controls['cargoFuncionContactoComercial'].enable();
    this.empresaFormGroup.controls['emailContactoComercial'].enable();
    this.empresaFormGroup.controls['telefonoPrincipalContactoComercial'].enable();
    this.empresaFormGroup.controls['telefonoSecundarioContactoComercial'].enable();
    this.empresaFormGroup.controls['nombreContactoTecnico'].enable();
    this.empresaFormGroup.controls['cargoFuncionContactoTecnico'].enable();
    this.empresaFormGroup.controls['emailContactoTecnico'].enable();
    this.empresaFormGroup.controls['telefonoPrincipalContactoTecnico'].enable();
    this.empresaFormGroup.controls['telefonoSecundarioContactoTecnico'].enable();
    this.empresaFormGroup.controls['region'].enable();
    this.empresaFormGroup.controls['comuna'].enable();
  }
  desHabilitarEmpresaFormGroup(){
    this.empresaFormGroup.controls['nombreFantasia'].disable();
    this.empresaFormGroup.controls['direccion'].disable();
    this.empresaFormGroup.controls['giroPrincipal'].disable();
    this.empresaFormGroup.controls['nombreContactoComercial'].disable();
    this.empresaFormGroup.controls['cargoFuncionContactoComercial'].disable();
    this.empresaFormGroup.controls['emailContactoComercial'].disable();
    this.empresaFormGroup.controls['telefonoPrincipalContactoComercial'].disable();
    this.empresaFormGroup.controls['telefonoSecundarioContactoComercial'].disable();
    this.empresaFormGroup.controls['nombreContactoTecnico'].disable();
    this.empresaFormGroup.controls['cargoFuncionContactoTecnico'].disable();
    this.empresaFormGroup.controls['emailContactoTecnico'].disable();
    this.empresaFormGroup.controls['telefonoPrincipalContactoTecnico'].disable();
    this.empresaFormGroup.controls['telefonoSecundarioContactoTecnico'].disable();
    this.empresaFormGroup.controls['region'].disable();
    this.empresaFormGroup.controls['comuna'].disable();
  }
  setValuesEmpresaFormGroup(){
    this.comunas(this.empresaActual.region.id);
    this.empresaFormGroup.controls['rut'].setValue(this.empresaActual.rut);
    this.empresaFormGroup.controls['razonSocial'].setValue(this.empresaActual.razonSocial);
    this.empresaFormGroup.controls['nombreFantasia'].setValue(this.empresaActual.nombreFantasia);
    this.empresaFormGroup.controls['direccion'].setValue(this.empresaActual.direccion);
    this.empresaFormGroup.controls['giroPrincipal'].setValue(this.empresaActual.giroPrincipal);
    this.empresaFormGroup.controls['nombreContactoComercial'].setValue(this.empresaActual.nombreContactoComercial);
    this.empresaFormGroup.controls['cargoFuncionContactoComercial'].setValue(this.empresaActual.cargoFuncionContactoComercial);
    this.empresaFormGroup.controls['emailContactoComercial'].setValue(this.empresaActual.emailContactoComercial);
    this.empresaFormGroup.controls['emailContactoTecnico'].setValue(this.empresaActual.emailContactoTecnico);
    this.empresaFormGroup.controls['telefonoPrincipalContactoComercial'].setValue(this.empresaActual.telefonoPrincipalContactoComercial);
    this.empresaFormGroup.controls['telefonoSecundarioContactoComercial'].setValue(this.empresaActual.telefonoSecundarioContactoComercial);
    this.empresaFormGroup.controls['nombreContactoTecnico'].setValue(this.empresaActual.nombreContactoTecnico);
    this.empresaFormGroup.controls['cargoFuncionContactoTecnico'].setValue(this.empresaActual.cargoFuncionContactoTecnico);
    this.empresaFormGroup.controls['telefonoSecundarioContactoTecnico'].setValue(this.empresaActual.telefonoSecundarioContactoTecnico);
    this.empresaFormGroup.controls['telefonoPrincipalContactoTecnico'].setValue(this.empresaActual.telefonoPrincipalContactoTecnico);

    this.empresaFormGroup.controls['region'].setValue(this.empresaActual.region.nombre);
    this.empresaFormGroup.controls['comuna'].setValue(this.empresaActual.comuna.nombre);
    this.empresaFormGroup.controls['idEmpresa'].setValue(this.empresaActual.idEmpresa);
    this.empresaInsert.region = this.empresaActual.region;
    this.empresaInsert.comuna = this.empresaActual.comuna;
  }
  listarRegiones(){
    this.regionService.regiones().subscribe(
      (response : any)=>{
        this.listaRegiones = response;
      }
    );
  }
  cancelar(){
    this.editar = true;
    this.setValuesEmpresaFormGroup();
    this.desHabilitarEmpresaFormGroup();
  }
  comunas(idRegion : number){
    this.comunaService.comunas(idRegion).subscribe(
      (response : any )=>{
        this.listaComunas = response;
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
  actualizaEmpresa(empresa :Empresa){
    // set value empresa insert
    this.empresaInsert.idEmpresa = this.empresaFormGroup.controls['idEmpresa'].value;
    this.empresaInsert.rut = this.empresaFormGroup.controls['rut'].value;
    this.empresaInsert.razonSocial = this.empresaFormGroup.controls['razonSocial'].value;
    this.empresaInsert.nombreFantasia = this.empresaFormGroup.controls['nombreFantasia'].value;
    this.empresaInsert.direccion = this.empresaFormGroup.controls['direccion'].value;
    this.empresaInsert.giroPrincipal = this.empresaFormGroup.controls['giroPrincipal'].value;
    this.empresaInsert.nombreContactoComercial = this.empresaFormGroup.controls['nombreContactoComercial'].value;
    this.empresaInsert.cargoFuncionContactoComercial = this.empresaFormGroup.controls['cargoFuncionContactoComercial'].value;
    this.empresaInsert.emailContactoComercial = this.empresaFormGroup.controls['emailContactoComercial'].value;
    this.empresaInsert.emailContactoTecnico = this.empresaFormGroup.controls['emailContactoTecnico'].value;
    this.empresaInsert.telefonoPrincipalContactoComercial = this.empresaFormGroup.controls['telefonoPrincipalContactoComercial'].value;
    this.empresaInsert.telefonoSecundarioContactoComercial = this.empresaFormGroup.controls['telefonoSecundarioContactoComercial'].value;
    this.empresaInsert.nombreContactoTecnico = this.empresaFormGroup.controls['nombreContactoTecnico'].value;
    this.empresaInsert.cargoFuncionContactoTecnico = this.empresaFormGroup.controls['cargoFuncionContactoTecnico'].value;
    this.empresaInsert.telefonoSecundarioContactoTecnico = this.empresaFormGroup.controls['telefonoSecundarioContactoTecnico'].value;
    this.empresaInsert.telefonoPrincipalContactoTecnico = this.empresaFormGroup.controls['telefonoPrincipalContactoTecnico'].value;

    this.empresaService.actualizarEmpresa(this.empresaInsert).subscribe(
      response=>{
      this.showToast();
        let objectEncryptEmpresaAcual = this.encryptService.encrypt(JSON.stringify(response));
        localStorage.setItem("empresaActual", null);
        localStorage.setItem("empresaActual", objectEncryptEmpresaAcual);
        this.empresaActual = response;
      }
    ); 
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

    this.toastrService[this.type](this.message || this.getMessage(), this.title, options);
  }

  getMessage() {
    const msgs = [
      'Empresa editada Correctamente'
    ];

    this.curMsgIndex++;

    if (this.curMsgIndex === msgs.length) { this.curMsgIndex = 0; }

    return msgs[this.curMsgIndex];
  }

}
