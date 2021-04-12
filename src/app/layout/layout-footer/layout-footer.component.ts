import { Component, HostBinding } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { TerminoCondicionesComponent } from '../../login/activar-usuario/termino-condiciones/termino-condiciones.component';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styles: [':host { display: block; }']
})
export class LayoutFooterComponent {
  @HostBinding('class.layout-footer') private hostClassMain = true;

  constructor(private appService: AppService, private dialog : NgbModal) {}

  currentBg() {
    return `bg-${this.appService.layoutFooterBg}`;
  }
  modalTerminoCondiciones(){
    console.log("hola")
    const dialog = this.dialog.open(TerminoCondicionesComponent, { windowClass: 'modal-lg animate' });
  }
}
