import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../sistema/services/login.service';

@Component({
  selector: 'app-activar-usuario',
  templateUrl: './activar-usuario.component.html',
  styles: []
})
export class ActivarUsuarioComponent implements OnInit {
  email: string;
  mensaje: string;
  error: string;
  porcentaje: number = 0;
  constructor(private loginService: LoginService,
    public route: ActivatedRoute) { }

  ngOnInit() {
  }

}
