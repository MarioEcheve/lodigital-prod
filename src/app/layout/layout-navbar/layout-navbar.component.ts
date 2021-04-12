import { Component, Input, HostBinding } from '@angular/core';
import { LoginService } from '../../sistema/services/login.service';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { EncryptService } from '../../sistema/services/encrypt.service';
import { Empresa } from '../../sistema/model/empresa';
import { UsuarioEmpresa } from '../../sistema/model/usuario-empresa';
import { UsuarioEmpresaService } from '../../sistema/services/usuario-empresa.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RutUtil } from '../../sistema/util/rut-util';

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
  empresaUsuarioRol : any;
  @Input() sidenavToggle = true;
  index = 1;
  @HostBinding('class.layout-navbar') private hostClassMain = true;
  formNav : FormGroup;
  constructor(private appService: AppService, 
              private layoutService: LayoutService,
              private loginService : LoginService,
              private encryptService : EncryptService,
              private router : Router,
              private fb : FormBuilder, ) {
    this.isRTL = appService.isRTL;
    this.empresas = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresas')));
    this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
    this.empresaUsuarioRol =  JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaUsuarioRol')));

    this.empresas.forEach(element => {
      element.empresa.rut = RutUtil.rutConPuntosConGuion(element.empresa.rut)
    }); 
    console.log(this.empresaUsuarioRol)

    this.inicializaFormNav();
  }
  inicializaFormNav(){
    this.formNav = this.fb.group({
      empresa : this.empresaActual.idEmpresa
    });
    if(this.empresas.length === 1){
      this.formNav.controls['empresa'].disable();
    }
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
  cambiarEmpresa(idEmpresa : any){
    let empresaSeleccionada = this.empresas.find(x=> 
      x.empresa.idEmpresa == idEmpresa
    );
    let objectEncryptEmpresaUsuarioRol = this.encryptService.encrypt(JSON.stringify(empresaSeleccionada));
    let objEncryptEmpresaActual = this.encryptService.encrypt(JSON.stringify(empresaSeleccionada.empresa));
    localStorage.setItem("empresaUsuarioRol", null);
    localStorage.setItem("empresaUsuarioRol", objectEncryptEmpresaUsuarioRol);
    localStorage.setItem("empresaActual", objEncryptEmpresaActual);
    this.router.navigate(['dashboards/dashboard-1']);
    this.layoutService._redrawLayoutSidenav()
 // navigate to same route

     this.empresaActual = JSON.parse(this.encryptService.decrypt(localStorage.getItem('empresaActual')));
     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboards/dashboard-1']); // navigate to same route
    });   
  } 
}
