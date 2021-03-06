import { Comuna } from "./comuna";
import { Region } from "./region";

export class Empresa {
    idEmpresa : number;
    rut: string;
    razonSocial: string;
    nombreFantasia: string;
    direccion: string;
    giroPrincipal: string;
    nombreContactoComercial: string;
    cargoFuncionContactoComercial: string;
    emailContactoComercial: string;
    telefonoPrincipalContactoComercial: string;
    telefonoSecundarioContactoComercial: string;
    nombreContactoTecnico: string;
    cargoFuncionContactoTecnico: string;
    emailContactoTecnico: string;
    telefonoPrincipalContactoTecnico: string;
    telefonoSecundarioContactoTecnico: string;
    fechaCreacion : Date;
    fechaModificacion : Date;
    region : Region;
    comuna : Comuna;


    
}