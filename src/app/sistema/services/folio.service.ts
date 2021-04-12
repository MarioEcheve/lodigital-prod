import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GenerarCodigoVerificacionDTO } from '../DTO/GenerarCodigoVerificacionDTO';
import { Folio } from '../model/folio';

@Injectable({
  providedIn: 'root'
})
export class FolioService {

  url: string = `${environment.HOST}/folio`;
  constructor(private http: HttpClient) { }

  public  async folioByLibro(idLibro : number){
    return await this.http.get<Folio[]>(`${this.url}/folioByLibro/${idLibro}`).toPromise();
  }
  public async crearFolio(folio : Folio){
    return await this.http.post<Folio>(`${this.url}/crearFolio`,folio).toPromise();
  }
  public  async folioById(idFolio : number){
    return await this.http.get<Folio>(`${this.url}/folioById/${idFolio}`).toPromise();
  }
  public  async eliminarFolioBorrador(idFolio : number){
    return await this.http.get<Boolean>(`${this.url}/eliminarFolioBorrador/${idFolio}`).toPromise();
  }
  async previsualizarPdf(html,codigoVerificacion){
    return await this.http.post<any>(`https://nodejs-lodigital.herokuapp.com/htmlToPdf`,{html,codigoVerificacion}).toPromise();
  }
  async buscaCorrelativoFolio(idLibro : number){
    return await this.http.get<any>(`${this.url}/correlativoFolio/${idLibro}`).toPromise();
  }
  async generarCodigoVerificacion(generarCodigoVerificacionDTO : GenerarCodigoVerificacionDTO){
    return await this.http.post<any>(`${this.url}/generarCodigoVerificacion`,generarCodigoVerificacionDTO).toPromise();
  }
}
