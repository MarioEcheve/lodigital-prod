import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPersonalizadoComponent } from './login-personalizado/login-personalizado.component';
import { LoginComponent } from './login/login.component';
import { Login1Component } from './login1/login1.component';
import { Login2Component } from './login2/login2.component';
import { SolicitarPasswordComponent } from './solicitar-password/solicitar-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login-personalizado', component: LoginPersonalizadoComponent },
  { path: 'login1', component: Login1Component },
  { path: 'login2', component: Login2Component },
  { path: 'solicitar-contraseña', component: SolicitarPasswordComponent },



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
