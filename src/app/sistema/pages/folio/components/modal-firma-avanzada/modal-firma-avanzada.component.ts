import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-firma-avanzada',
  templateUrl: './modal-firma-avanzada.component.html',
  styles: []
})
export class ModalFirmaAvanzadaComponent implements OnInit {

  constructor(private dialog : NgbModal) { }

  cancelar2(){
    this.dialog.dismissAll();
  }

  ngOnInit() {
  }

  

}
