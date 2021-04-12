export class RutUtil {

    public static rutConPuntosConGuion(rut: string): any {
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
  
      if (rut.length === 1) {
        return rut;
      }
  
      const numeros: string = rut.substring(0, rut.length - 1);
      const dv: string = rut.slice(-1);
  
      return (Number(numeros).toLocaleString('en') + '-' + dv).replace(/,/g, '.');
    }
  
    public static rutSinPuntosConGuion(rut: string): any {
      rut = rut.replace(/\./g, '');
      rut = rut.replace(/-/g, '');
  
      const numeros: string = rut.substring(0, rut.length - 1);
      const dv: string = rut.slice(-1);
  
      return `${numeros}-${dv}`; // '17590385-2'
    }
  
    static formatearRutAFormatoSinDigitoVerificador(rutConGuionYDigitoVerificador: string) {
      return rutConGuionYDigitoVerificador.split('-')[0];
    }
  
    static formetearRutAFormatoSinPuntosNiGuion(rut: string) {
      let rutProvisorio = rut.replace('.', '');
      rutProvisorio = rut.replace('-', '');
      return rutProvisorio;
    }
  }
  