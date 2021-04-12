import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-firma-credenciales',
  templateUrl: './modal-firma-credenciales.component.html',
  styles: []
})
export class ModalFirmaCredencialesComponent implements OnInit {

  constructor(private dialog : NgbModal) { }

  cancelar2(){
    this.dialog.dismissAll();
  }

  ngOnInit() {
  }

}
