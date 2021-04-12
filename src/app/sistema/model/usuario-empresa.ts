import { Empresa } from "./empresa";
import { EstadoUsuario } from "./estadoUsuario";
import { Roles } from "./roles";
import { Usuario } from "./usuario"

export class UsuarioEmpresa {
    usuario : Usuario;
    empresa : Empresa;
    estadoUsuario: EstadoUsuario;
    fechaCreacion : Date;
    fechaActivacion : Date;
    fechaDesactivacion : Date;
    rol : Roles;
    nombreCompleto: string;
}