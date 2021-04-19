import { Component, OnInit } from '@angular/core';
import { BehaviorSubjectMenu } from '../../../config/BehaviorSubject';
import { Comuna } from '../../../model/comuna';
import { Contrato } from '../../../model/Contrato';
import { Empresa } from '../../../model/empresa';
import { Region } from '../../../model/region';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { ComunaService } from '../../../services/comuna.service';
import { ContratoService } from '../../../services/contrato.service';
import { EncryptService } from '../../../services/encrypt.service';
import { RegionService } from '../../../services/region.service';

@Component({
  selector: 'app-listado-contrato',
  templateUrl: './listado-contrato.component.html',
  styles: []
})
export class ListadoContratoComponent implements OnInit {

  listaContratos : Contrato[] = [];
  empresaActual : Empresa;
  empresaUsuarioRol : UsuarioEmpresa;
  mostrarTablaContrato : Boolean = true;
  mostrarEditarContrato : Boolean = false;
  contrato : Contrato;

  constructor(private contratoService : ContratoService,
              private encryptService : EncryptService) { 
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.buscarContratosByCompany(this.empresaActual.idEmpresa);
  }

  dtOptions: DataTables.Settings = {};
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu : [ 20 , 50 , 100 ],
      processing: true,      
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ registros',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de un total de _TOTAL_ registros',
        infoEmpty: 'De 0 a 0 de 0 registros',
        infoFiltered: '(filtrados de _MAX_ registros totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        }
      }
    };
    this.mostrarTablaContrato = true;

  }

  async buscarContratosByCompany(idEmpresa : number){
    this.listaContratos = await this.contratoService.contratoByCompany(idEmpresa);
  }
  nuevoContrato(){
    this.mostrarTablaContrato = false;
    this.mostrarTablaContrato=false
  }
  async proceso(value){
    await this.buscarContratosByCompany(this.empresaActual.idEmpresa);
    if(!value){
      this.mostrarTablaContrato = true;
      this.mostrarEditarContrato = false;
    }
  }
  editar(row){
    this.mostrarTablaContrato = false;
    this.mostrarEditarContrato = true;
    this.contrato = row;
  }
}
