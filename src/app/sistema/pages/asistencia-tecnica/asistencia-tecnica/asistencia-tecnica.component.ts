import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencia-tecnica',
  templateUrl: './asistencia-tecnica.component.html',
  styles: []
})
export class AsistenciaTecnicaComponent implements OnInit {

  public data = [
    {name: '1', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '2', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '3', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '4', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '5', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '6', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '7', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '8', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '9', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '10', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '11', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '12', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '13', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '14', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '15', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '16', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '17', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '18', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '19', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '20', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '21', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '22', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '23', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '24', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '25', email: 'Entrega Terreno - Por medio de la presente', website:'therichpost.com'},
    {name: '26', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '27', email: 'therichpost@gmail.com', website:'therichpost.com'},
    {name: '2800', email: 'therichpost@gmail.com', website:'therichpost.com'},
  ];

  constructor() { }

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
