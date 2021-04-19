import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Folio } from '../../../../../model/folio';
import { Usuario } from '../../../../../model/usuario';
import { UsuarioLibro } from '../../../../../model/usuarioLibro';
import { FolioService } from '../../../../../services/folio.service';
import { UsuarioLibroService } from '../../../../../services/usuario-libro.service';
import { VisualizarPdfComponent } from '../../../components/visualizar-pdf/visualizar-pdf.component';

@Component({
  selector: 'app-folio-referencia',
  templateUrl: './folio-referencia.component.html',
  styles: [
    './folio-referencia.component.scss',
  ]
})
export class FolioReferenciaComponent implements OnInit, AfterViewInit {
  listaLibroUsuario : UsuarioLibro[] = [];
  @Input() private usuario : Usuario;
  @Input() private folio : Folio;
  @Input() private modal : any;

  listaFolios : Folio[] = [];
  controlLibroSeleccionado = new FormControl("",[]);

  // implementacion datatable //
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private dialog : NgbModal,
              private usuarioLibroService : UsuarioLibroService,
              private folioService : FolioService) { 
    
  }

  cancelar(){
    this.modal.close();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu : [ 10 , 20 , 50 ],
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

  async librosUsuario(idUsuario,idContrato){
    let response = await this.usuarioLibroService.buscarUsuarioLibrosByUsuario(idUsuario,idContrato);
    this.listaLibroUsuario = response;
  }

  async cambiarLibro(idLibro?){
    if(idLibro !== undefined){
      this.controlLibroSeleccionado.setValue(idLibro);
    }
    const response = await this.folioService.folioByLibro(this.controlLibroSeleccionado.value);
    this.listaFolios = response;
    this.rerender();
  }

  ngAfterViewInit(){
    this.librosUsuario(this.usuario.idUsuario, this.folio.libro.contrato.id);
    this.cambiarLibro(this.folio.libro.idLibro);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  modalFolioReferencia(folio){
    const dialog = this.dialog.open(VisualizarPdfComponent, { windowClass: 'modal-xl animate' });   
    dialog.componentInstance.html = folio.pdfFirmado;
    dialog.componentInstance.folio = this.folio;
    dialog.componentInstance.soloVisualizar = true;
    dialog.componentInstance.modal = dialog;
  }
  agregarFolioReferencia(folio : Folio){
    this.folioService.AgregarFolioReferenciaAlista(folio);
    /* this.modal.close(folio); */
  }
  
}
