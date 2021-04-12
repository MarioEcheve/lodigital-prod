import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosComponent } from './pages/administracion/contratos/contratos.component';
import { EmpresaComponent } from './pages/administracion/empresa/empresa.component';
import { NuevoUsuarioComponent } from './pages/administracion/componentes/nuevo-usuario/nuevo-usuario.component';
import { UsuarioComponent } from './pages/administracion/usuario/usuario.component';
import { ListadoContratoComponent } from './pages/contrato/listado-contrato/listado-contrato.component';
import { DetalleContratoComponent } from './pages/contrato/detalle-contrato/detalle-contrato.component';
import { FolioBorradorComponent } from './pages/folio/folio-borrador/folio-borrador.component';
import { FolioFirmadoComponent } from './pages/folio/folio-firmado/folio-firmado.component';
import { ResumenFolioComponent } from './pages/folio/resumen-folio/resumen-folio.component';
import { DetalleLibroComponent } from './pages/libro/detalle-libro/detalle-libro.component';
import { ListadoLibrosComponent } from './pages/libro/listado-libros/listado-libros.component';
import { CambioClaveComponent } from './pages/usuario/cambio-clave/cambio-clave.component';
import { InformacionPersonaComponent } from './pages/usuario/informacion-persona/informacion-persona.component';
import { PreferenciasComponent } from './pages/usuario/preferencias/preferencias.component';
import { LibroComponent } from './pages/libro/libro/libro.component';
import { AsistenciaTecnicaComponent } from './pages/asistencia-tecnica/asistencia-tecnica/asistencia-tecnica.component';
import { DescargasInstaladoresComponent } from './pages/descargas-instaladores/descargas-instaladores/descargas-instaladores.component';
import { ContratosAbiertosComponent } from './pages/contrato/contratos-abiertos/contratos-abiertos.component';

const routes: Routes = [
  { path: 'folio-borrador', component: FolioBorradorComponent},
  { path: 'folio-borrador/:idFolio', component: FolioBorradorComponent},
  { path: 'folio-firmado/:idFolio', component: FolioFirmadoComponent },
  { path: 'resumen-de-folio/:idLibro', component: ResumenFolioComponent },
  { path: 'detalle-contrato', component: DetalleContratoComponent },
  { path: 'detalle-libro/:idLibro', component: DetalleLibroComponent },
  { path: 'listado-contrato', component: ListadoContratoComponent },
  { path: 'listado-libros', component: ListadoLibrosComponent },
  { path: 'nuevo-libro/:idContrato', component: LibroComponent },
  { path: 'empresa', component: EmpresaComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'contratos', component: ContratosComponent },
  { path: 'informacion-persona', component: InformacionPersonaComponent },
  { path: 'preferencias', component: PreferenciasComponent },
  { path: 'cambio-de-clave', component: CambioClaveComponent },
  { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
  { path: 'asistencia-tecnica', component: AsistenciaTecnicaComponent },
  { path: 'descargas-instaladores', component: DescargasInstaladoresComponent },
  { path: 'contratos-abiertos', component: ContratosAbiertosComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
