import { Empresa } from "../model/empresa";
import { EstadoUsuario } from "../model/estadoUsuario";
import { ResetToken } from "../model/ResetToken";
import { Roles } from "../model/roles";
import { Usuario } from "../model/usuario";

export class UsuarioEmpresaDTO {
    usuario : Usuario;
    empresa : Empresa;
    estadoUsuario: EstadoUsuario;
    fechaCreacion : Date;
    fechaActivacion : Date;
    fechaDesactivacion : Date;
    rol : Roles;
    token : string;
}