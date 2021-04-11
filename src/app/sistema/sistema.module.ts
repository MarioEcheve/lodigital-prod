import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FolioBorradorComponent } from './pages/folio/folio-borrador/folio-borrador.component';
import { QuillModule } from '../../vendor/libs/quill/quill.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { FileUploadModule } from 'ng2-file-upload';
import { FolioFirmadoComponent } from './pages/folio/folio-firmado/folio-firmado.component';
import { ChipsFolioBorradorComponent } from './pages/folio/folio-borrador/components/chips-folio-borrador/chips-folio-borrador.component';
import { TagInputModule } from 'ngx-chips';
import { ResumenFolioComponent } from './pages/folio/resumen-folio/resumen-folio.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { SortablejsModule } from 'angular-sortablejs';
import { DetalleContratoComponent } from './pages/contrato/detalle-contrato/detalle-contrato.component';
import { ContratoComponent } from './pages/contrato/contrato/contrato.component';
import { DetalleLibroComponent } from './pages/libro/detalle-libro/detalle-libro.component';
import { LibroComponent } from './pages/libro/libro/libro.component';
import { ListadoLibrosComponent } from './pages/libro/listado-libros/listado-libros.component';
import { ListadoContratoComponent } from './pages/contrato/contrato/listado-contrato/listado-contrato.component';
import { EmpresaComponent } from './pages/administracion/empresa/empresa.component';
import { UsuarioComponent } from './pages/administracion/usuario/usuario.component';
import { ContratosComponent } from './pages/administracion/contratos/contratos.component';
import { SistemaRoutingModule } from './sistema-routing.module';
import { NuevoContratoComponent } from './pages/administracion/nuevo-contrato/nuevo-contrato.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InformacionPersonaComponent } from './pages/usuario/informacion-persona/informacion-persona.component';
import { PreferenciasComponent } from './pages/usuario/preferencias/preferencias.component';
import { CambioClaveComponent } from './pages/usuario/cambio-clave/cambio-clave.component';

@NgModule({
  declarations: [ FolioBorradorComponent, FolioFirmadoComponent, ChipsFolioBorradorComponent, ResumenFolioComponent, DetalleContratoComponent, ContratoComponent, DetalleLibroComponent, LibroComponent, ListadoLibrosComponent, ListadoContratoComponent, EmpresaComponent, UsuarioComponent, ContratosComponent, NuevoContratoComponent, InformacionPersonaComponent, PreferenciasComponent, CambioClaveComponent],
  imports: [
    CommonModule,
    SistemaRoutingModule,
    NgFormsModule,
    HttpClientModule,
    NgbModule,
    QuillModule,
    DropzoneModule,
    FileUploadModule,
    TagInputModule,
    PerfectScrollbarModule,
    NgSelectModule,
    SortablejsModule,
    HttpClientModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
    // Libs
   
   // PagesRoutingModule
  ]
})
export class SistemaModule { }
