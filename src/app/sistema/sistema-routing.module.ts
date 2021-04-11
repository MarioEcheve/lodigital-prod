import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosComponent } from './pages/administracion/contratos/contratos.component';
import { EmpresaComponent } from './pages/administracion/empresa/empresa.component';
import { NuevoContratoComponent } from './pages/administracion/nuevo-contrato/nuevo-contrato.component';
import { UsuarioComponent } from './pages/administracion/usuario/usuario.component';
import { ListadoContratoComponent } from './pages/contrato/contrato/listado-contrato/listado-contrato.component';
import { DetalleContratoComponent } from './pages/contrato/detalle-contrato/detalle-contrato.component';
import { FolioBorradorComponent } from './pages/folio/folio-borrador/folio-borrador.component';
import { FolioFirmadoComponent } from './pages/folio/folio-firmado/folio-firmado.component';
import { ResumenFolioComponent } from './pages/folio/resumen-folio/resumen-folio.component';
import { DetalleLibroComponent } from './pages/libro/detalle-libro/detalle-libro.component';
import { ListadoLibrosComponent } from './pages/libro/listado-libros/listado-libros.component';
import { CambioClaveComponent } from './pages/usuario/cambio-clave/cambio-clave.component';
import { InformacionPersonaComponent } from './pages/usuario/informacion-persona/informacion-persona.component';
import { PreferenciasComponent } from './pages/usuario/preferencias/preferencias.component';

const routes: Routes = [
  { path: 'folio-borrador', component: FolioBorradorComponent },
  { path: 'folio-firmado', component: FolioFirmadoComponent },
  { path: 'resumen-de-folio', component: ResumenFolioComponent },
  { path: 'detalle-contrato', component: DetalleContratoComponent },
  { path: 'detalle-libro', component: DetalleLibroComponent },
  { path: 'listado-contrato', component: ListadoContratoComponent },
  { path: 'listado-libros', component: ListadoLibrosComponent },
  { path: 'empresa', component: EmpresaComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'contratos', component: ContratosComponent },
  { path: 'nuevo-contrato', component: NuevoContratoComponent },
  { path: 'informacion-persona', component: InformacionPersonaComponent },
  { path: 'preferencias', component: PreferenciasComponent },
  { path: 'cambio-de-clave', component: CambioClaveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
