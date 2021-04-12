import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmar-eliminacion',
  templateUrl: './modal-confirmar-eliminacion.component.html',
  styles: []
})
export class ModalConfirmarEliminacionComponent implements OnInit {

  constructor( private dialog : NgbModal) { }

  ngOnInit() {
  }
  eliminar(){
    this.dialog.dismissAll(1);
  }
  cancelar(){
    this.dialog.dismissAll();
  }
}
