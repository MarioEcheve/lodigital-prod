import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comuna } from '../../../model/comuna';
import { Empresa } from '../../../model/empresa';
import { Region } from '../../../model/region';
import { ComunaService } from '../../../services/comuna.service';
import { EncryptService } from '../../../services/encrypt.service';
import { RegionService } from '../../../services/region.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: []
})
export class EmpresaComponent implements OnInit {
  empresaActual : any;
  empresaFormGroup : FormGroup;
  editar = true;
  listaRegiones : Region[] = [];
  listaComunas : Comuna[] = [];
  constructor(private encryptService : EncryptService,
              private fb : FormBuilder,
              private regionService : RegionService,
              private comunaService : ComunaService) { 
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
  }

  ngOnInit() {
    this.inicializarEmpresaFormGroup();
    this.desHabilitarEmpresaFormGroup();
    this.setValuesEmpresaFormGroup();
    this.listarRegiones();
  }
  inicializarEmpresaFormGroup(){
    this.empresaFormGroup = this.fb.group({
      rutEmpresa : [''],
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
    }else{
      this.desHabilitarEmpresaFormGroup();
      this.editar = true;
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
    this.empresaFormGroup.controls['rutEmpresa'].setValue(this.empresaActual.empresa.rut);
    this.empresaFormGroup.controls['razonSocial'].setValue(this.empresaActual.empresa.razonSocial);
    this.empresaFormGroup.controls['nombreFantasia'].setValue(this.empresaActual.empresa.nombreFantasia);
    this.empresaFormGroup.controls['direccion'].setValue(this.empresaActual.empresa.direccion);
    this.empresaFormGroup.controls['giroPrincipal'].setValue(this.empresaActual.empresa.giroPrincipal);
    this.empresaFormGroup.controls['nombreContactoComercial'].setValue(this.empresaActual.empresa.nombreContactoComercial);
    this.empresaFormGroup.controls['cargoFuncionContactoComercial'].setValue(this.empresaActual.empresa.cargoFuncionContactoComercial);
    this.empresaFormGroup.controls['emailContactoComercial'].setValue(this.empresaActual.empresa.emailContactoComercial);
    this.empresaFormGroup.controls['telefonoPrincipalContactoComercial'].setValue(this.empresaActual.empresa.telefonoPrincipalContactoComercial);
    this.empresaFormGroup.controls['telefonoSecundarioContactoComercial'].setValue(this.empresaActual.empresa.telefonoSecundarioContactoComercial);
    this.empresaFormGroup.controls['nombreContactoTecnico'].setValue(this.empresaActual.empresa.nombreContactoTecnico);
    this.empresaFormGroup.controls['cargoFuncionContactoTecnico'].setValue(this.empresaActual.empresa.cargoFuncionContactoTecnico);
    this.empresaFormGroup.controls['telefonoSecundarioContactoTecnico'].setValue(this.empresaActual.empresa.telefonoSecundarioContactoTecnico);
    this.empresaFormGroup.controls['region'].setValue(this.empresaActual.empresa.region.nombre);
    this.empresaFormGroup.controls['comuna'].setValue(this.empresaActual.empresa.comuna.nombre);

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
    this.comunas(regionSelected.id);
  }
}
