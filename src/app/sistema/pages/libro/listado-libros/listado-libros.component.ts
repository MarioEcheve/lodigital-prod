import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Empresa } from '../../../model/empresa';
import { UsuarioEmpresa } from '../../../model/usuario-empresa';
import { UsuarioLibro } from '../../../model/usuarioLibro';
import { EncryptService } from '../../../services/encrypt.service';
import { UsuarioLibroService } from '../../../services/usuario-libro.service';
/* import { AppService } from '../../../../app.service'; */

@Component({
  selector: 'app-listado-libros',
  templateUrl: './listado-libros.component.html',
  styleUrls: [
  ],
})
export class ListadoLibrosComponent implements AfterViewInit, OnDestroy, OnInit {
  // implementacion datatable //
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dtTrigger: Subject<any> = new Subject<any>();

  empresaActual: Empresa;
  empresaUsuarioRol: UsuarioEmpresa;
  usuarioLibros: UsuarioLibro[];
  constructor(private encryptService: EncryptService, private usurioLibroService: UsuarioLibroService, private router: Router) {
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));
    this.buscarMisLibro();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [20, 50, 100],
      processing: true,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de un total de _TOTAL_ folios',
        infoEmpty: 'De 0 a 0 de 0 folios',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        }
      }
    };
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit() {}

  async buscarMisLibro() {
    this.usuarioLibros = await this.usurioLibroService.buscarMisLibros(this.empresaUsuarioRol.usuario.idUsuario);
    this.dtTrigger.next();
  }
  folioResumen(usuarioLibro) {
    this.router.navigate(['/sistema/resumen-de-folio/', usuarioLibro.libro.idLibro]);
  }
  detalleLibro(usuarioLibro) {
    this.router.navigate(['/sistema/detalle-libro/', usuarioLibro.libro.idLibro]);
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
