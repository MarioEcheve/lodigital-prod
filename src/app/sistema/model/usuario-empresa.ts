import { Empresa } from "./empresa";
import { Usuario } from "./usuario"

export class UsuarioEmpresa {
    usuario : Usuario = new Usuario();
    empresa : Empresa = new Empresa();
    enabled: Boolean;
}