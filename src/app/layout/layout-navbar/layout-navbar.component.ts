import { Component, Input, HostBinding } from '@angular/core';
import { LoginService } from '../../sistema/services/login.service';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { EncryptService } from '../../sistema/services/encrypt.service';
import { Empresa } from '../../sistema/model/empresa';
import { UsuarioEmpresa } from '../../sistema/model/usuario-empresa';
import { UsuarioEmpresaService } from '../../sistema/services/usuario-empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }']
})
export class LayoutNavbarComponent {
  isExpanded = false;
  isRTL: boolean;
  empresas : any;
  empresaActual : Empresa = new Empresa();
  @Input() sidenavToggle = true;
  index = 1;
  @HostBinding('class.layout-navbar') private hostClassMain = true;

  constructor(private appService: AppService, 
              private layoutService: LayoutService,
              private loginService : LoginService,
              private encryptService : EncryptService,
              private usuarioEmpresaService : UsuarioEmpresaService,
              private router : Router ) {
    this.isRTL = appService.isRTL;
    this.empresas = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresas')));
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    console.log(this.empresas);
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }
  cerrarSesion(){
    this.loginService.cerrarSesion();
  }
  cambiarEmpresa(idEmpresa : any,empresa){
    let empresaSeleccionada = this.empresas.find(x=> 
      x.empresa.idEmpresa == idEmpresa
    );
    let objectEncryptEmpresaAcual = this.encryptService.encrypt(JSON.stringify(empresaSeleccionada));
    localStorage.setItem("empresaActual", objectEncryptEmpresaAcual);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboards/dashboard-1']); // navigate to same route
   }); 
  } 
}
