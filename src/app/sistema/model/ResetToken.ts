import { Usuario } from "./usuario";

export class ResetToken {
    id: number;
    token : string;
    usuario: Usuario;
    expiracion : Date;
}