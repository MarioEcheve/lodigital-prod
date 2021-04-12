import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSummernoteModule } from 'ngx-summernote';

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
import { ListadoContratoComponent } from './pages/contrato/listado-contrato/listado-contrato.component';
import { EmpresaComponent } from './pages/administracion/empresa/empresa.component';
import { UsuarioComponent } from './pages/administracion/usuario/usuario.component';
import { ContratosComponent } from './pages/administracion/contratos/contratos.component';
import { SistemaRoutingModule } from './sistema-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InformacionPersonaComponent } from './pages/usuario/informacion-persona/informacion-persona.component';
import { PreferenciasComponent } from './pages/usuario/preferencias/preferencias.component';
import { CambioClaveComponent } from './pages/usuario/cambio-clave/cambio-clave.component';
import { NuevoUsuarioComponent } from './pages/administracion/componentes/nuevo-usuario/nuevo-usuario.component';
import { TablaGestionUsuarioComponent } from './pages/administracion/componentes/tabla-gestion-usuario/tabla-gestion-usuario.component';
import { BlockUIModule } from 'ng-block-ui';
import { AsistenciaTecnicaComponent } from './pages/asistencia-tecnica/asistencia-tecnica/asistencia-tecnica.component';
import { DescargasInstaladoresComponent } from './pages/descargas-instaladores/descargas-instaladores/descargas-instaladores.component';
import { ContratosAbiertosComponent } from './pages/contrato/contratos-abiertos/contratos-abiertos.component';
import { ModalCrearUsuarioLibroComponent } from './pages/libro/components/modal-crear-usuario-libro/modal-crear-usuario-libro.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ArchwizardModule } from 'ng2-archwizard';
import { ColorPickerModule } from 'ngx-color-picker';
import { NouisliderModule } from 'ng2-nouislider';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

// data table
import { DataTablesModule } from 'angular-datatables';
import { FolioReferenciaComponent } from './pages/folio/folio-borrador/components/folio-referencia/folio-referencia.component'
import { AlertModule } from 'ngx-alerts';
import { ModalConfirmarEliminacionComponent } from './pages/folio/components/modal-confirmar-eliminacion/modal-confirmar-eliminacion.component';
import { VisualizarPdfComponent } from './pages/folio/components/visualizar-pdf/visualizar-pdf.component';
import { ModalFirmaCredencialesComponent } from './pages/folio/components/modal-firma-credenciales/modal-firma-credenciales.component';
import { ModalFirmaAvanzadaComponent } from './pages/folio/components/modal-firma-avanzada/modal-firma-avanzada.component';

@NgModule({
  declarations: [ 
    FolioBorradorComponent, 
    FolioFirmadoComponent, 
    ChipsFolioBorradorComponent, 
    ResumenFolioComponent, 
    DetalleContratoComponent, 
    ContratoComponent, 
    DetalleLibroComponent, 
    LibroComponent, 
    ListadoLibrosComponent, 
    ListadoContratoComponent, 
    EmpresaComponent, 
    UsuarioComponent, 
    ContratosComponent, 
    InformacionPersonaComponent, 
    PreferenciasComponent, 
    CambioClaveComponent, 
    NuevoUsuarioComponent, 
    TablaGestionUsuarioComponent, 
    AsistenciaTecnicaComponent, 
    DescargasInstaladoresComponent, 
    ContratosAbiertosComponent, 
    ModalCrearUsuarioLibroComponent, 
    FolioReferenciaComponent, 
    ModalConfirmarEliminacionComponent, 
    VisualizarPdfComponent, 
    ModalFirmaCredencialesComponent, 
    ModalFirmaAvanzadaComponent
  ],
  imports: [
    NgxSummernoteModule,
    DataTablesModule,
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
    ReactiveFormsModule,
    BlockUIModule,
    MultiselectDropdownModule,
    NgSelectModule,
    ArchwizardModule,
    TagInputModule,
    ColorPickerModule,
    NouisliderModule,
    LMarkdownEditorModule,
    QuillModule,
    AlertModule.forRoot()
    // Libs
   
   // PagesRoutingModule
  ],
  entryComponents : [
    ModalCrearUsuarioLibroComponent,
    FolioReferenciaComponent,
    ModalConfirmarEliminacionComponent,
    VisualizarPdfComponent,
    ModalFirmaCredencialesComponent, 
    ModalFirmaAvanzadaComponent
  ]
})
export class SistemaModule { }
