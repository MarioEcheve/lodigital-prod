import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-folio-referencia',
  templateUrl: './folio-referencia.component.html',
  styles: [
    './folio-referencia.component.scss',
  ]
})
export class FolioReferenciaComponent implements OnInit {

  public data = [
    {folio: '1', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '2', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},
    {folio: '3', emisor: 'Fernando Vilches Soleman', Tipofolio:'therichpost.com'},

  ];

  constructor(private dialog : NgbModal) { }

  cancelar(){
    this.dialog.dismissAll();
  }

  dtOptions: DataTables.Settings = {};
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

}
