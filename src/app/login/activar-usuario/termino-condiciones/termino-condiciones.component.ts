import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-termino-condiciones',
  templateUrl: './termino-condiciones.component.html',
  styles: []
})
export class TerminoCondicionesComponent implements OnInit {

  constructor(private dialog : NgbModal) { }
  cancelar(){
    this.dialog.dismissAll();
  }

  ngOnInit() {
  }

}
