import { ConfiguracionTipoFolioTipoLibro } from "./ConfiguracionTipoFolioTipoLibro";
import { Libro } from "./Libro";
import { TipoFolio } from "./tipoFolio";

export class Folio {
    idFolio : number;
    asunto : string;
    correlativo: number;
    idUsuarioCreador : number;
    idReceptor : number;
    idUsuarioFirma : number;
    estadoLectura : Boolean;
    estadoFolio : Boolean;
    entidadCreacion : Boolean;
    fechaCreacion : Date;
    fechaRequerida : Date;
    libro : Libro;
    idTipoFolio : number;
    configuracionTipoFolioTipoLibro : ConfiguracionTipoFolioTipoLibro;
    usuarioReceptor : string;
    usuarioCreador : string;
    anotacion : string;
    fechaModificacion : Date;
    pdfFirmadoContentType?: string;
    pdfFirmado?: any;
    pdfLecturaContentType?: string;
    pdfLectura?: any;
    fechaFirma : Date;
    codigoVerificacion: string;
    idFolioRespuesta : number;
}