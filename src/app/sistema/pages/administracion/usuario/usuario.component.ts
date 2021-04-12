import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../model/empresa';
import { Roles } from '../../../model/roles';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { EncryptService } from '../../../services/encrypt.service';
import { UsuarioEmpresaService } from '../../../services/usuario-empresa.service';
import { RutUtil } from '../../../util/rut-util';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  empresaActual: Empresa;
  empresaUsuarioRol: UsuarioEmpresa;
  usuariosEmpresa: UsuarioEmpresa[] = [];
  muestraTablaUsuario = true;
  empresaUsuarioRolEditar: any;
  rol: Roles;
  constructor(private usuarioEmpresaService: UsuarioEmpresaService,
    private encryptService: EncryptService) {
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.rol = this.empresaUsuarioRol.rol;
    this.obtenerUsuarios(this.empresaActual.idEmpresa);
  }

  dtOptions: DataTables.Settings = {};
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [20, 50, 100],
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
  }

  async obtenerUsuarios(idEmpresa: number) {
    this.usuariosEmpresa = [];
    let response = await this.usuarioEmpresaService.usuariosEmpresasByCompany(idEmpresa);
    response.forEach(element => {
      element.usuario.rut = RutUtil.rutConPuntosConGuion(element.usuario.rut);
    });
    this.usuariosEmpresa = response;
    this.muestraTablaUsuario = true;

  }
  nuevoUsuario() {
    this.empresaUsuarioRolEditar = null;
    this.muestraTablaUsuario = false;
  }
  async proceso(value) {
    await this.obtenerUsuarios(this.empresaActual.idEmpresa);
    if (!value) {
      this.muestraTablaUsuario = true;
    }
  }
  editar(row) {
    this.empresaUsuarioRolEditar = row;
    this.muestraTablaUsuario = false;
  }
}
