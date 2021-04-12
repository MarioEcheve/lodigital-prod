import { EstadoUsuarioLibro } from "./estadoUsuarioLibro";
import { Libro } from "./Libro";
import { PerfilUsuarioLibro } from "./perfilUsuarioLibro";
import { UsuarioEmpresa } from "./usuario-empresa";

export class UsuarioLibro {
    cargo ?: string;
    nombre? : string;
    libro? : Libro;
    usuarioEmpresa: UsuarioEmpresa;
    perfilUsuarioLibro? : PerfilUsuarioLibro;
    estadoUsuarioLibro? : EstadoUsuarioLibro;
    mandante? :Boolean;
}