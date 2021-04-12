import { Contrato } from "./Contrato";
import { EstadoLibro } from "./estadoLibro";
import { TipoFirma } from "./tipoFirna";
import { TipoLibro } from "./tipoLibro";

export class Libro {
    idLibro : number;
    codigo : string;
    nombre : string;
    descripcion : string;
    fechaCreacion : Date;
    fechaCierre : Date;
    fechaApertura : Date;
    tipoFirma : TipoFirma;
    tipoLibro : TipoLibro;
    estadoLibro : EstadoLibro;
    contrato : Contrato;
    accesoLibro : Boolean;
    libroAbierto: Boolean;

}