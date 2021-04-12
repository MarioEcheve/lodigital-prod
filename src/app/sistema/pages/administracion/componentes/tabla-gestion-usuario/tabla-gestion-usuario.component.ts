import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-gestion-usuario',
  templateUrl: './tabla-gestion-usuario.component.html',
  styles: []
})
export class TablaGestionUsuarioComponent implements OnInit {
  @Input() usuariosEmpresa: any;
  constructor() { }

  ngOnInit() {
    console.log(this.usuariosEmpresa);
  }
}
