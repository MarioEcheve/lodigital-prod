import { Roles } from "./roles";

export class Usuario {
    idUsuario : number;
    rut: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    profesionOficio: string;
    emailPrincipal: string;
    telefonoPrincipal: string;
    username:string;
    password: string;
    enabled: boolean;
    roles : Roles[];
}