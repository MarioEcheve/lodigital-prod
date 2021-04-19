import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GenerarCodigoVerificacionDTO } from '../DTO/GenerarCodigoVerificacionDTO';
import { Folio } from '../model/folio';

@Injectable({
  providedIn: 'root'
})
export class FolioService {

  url: string = `${environment.HOST}/folio`;
  private listaFoliosRelacionadosAgregadosSubject = new BehaviorSubject([]);
  private listaFolioRelacionadosAgregados : Folio[] = [];

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
  getListaFoliosRelacionadosAgregadosSubject(): Observable<Folio[]> {
    return this.listaFoliosRelacionadosAgregadosSubject.asObservable();
  }
  AgregarFolioReferenciaAlista(folio: any){
    let existe = this.listaFolioRelacionadosAgregados.includes(folio);
    if(existe !== true){
      this.listaFolioRelacionadosAgregados = [...this.listaFolioRelacionadosAgregados, folio];
    }
   /*  let existe = this.listaFolioRelacionadosAgregados.includes(folio);
    if(setValue === true){
      this.listaFolioRelacionadosAgregados = folios;
    }else{
      if(!existe){
        this.listaFolioRelacionadosAgregados = [...this.listaFolioRelacionadosAgregados, folio];
      }
    }
   */
  this.refreshListaListaFoliosAgregados();
  }
  refreshListaListaFoliosAgregados(){
    this.listaFoliosRelacionadosAgregadosSubject.next(this.listaFolioRelacionadosAgregados);
  }
}
