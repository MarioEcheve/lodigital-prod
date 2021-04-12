import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';
import { LoginPersonalizadoComponent } from './login-personalizado/login-personalizado.component';
import { Login1Component } from './login1/login1.component';
import { Login2Component } from './login2/login2.component';
import { RestablecerClaveComponent } from './restablecer-clave/restablecer-clave.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SolicitarPasswordComponent } from './solicitar-password/solicitar-password.component';
import { TerminoCondicionesComponent } from './activar-usuario/termino-condiciones/termino-condiciones.component';


@NgModule({
  declarations: [LoginComponent, LoginPersonalizadoComponent, Login1Component, Login2Component, SolicitarPasswordComponent, ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    NgFormsModule,
    HttpClientModule,
    NgbModule,
    BlockUIModule,
    ReactiveFormsModule,
    FormsModule,
    TextMaskModule
  ],

})
export class LoginModule { }
