import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FolioReferencia } from '../model/folioReferencia';

@Injectable({
  providedIn: 'root'
})
export class FolioReferenciaService {
  url: string = `${environment.HOST}/folioReferencia`;
  constructor(private http: HttpClient) { }

  async getFolioReferenciaByFolio(idFolio : number){
    return await this.http.get<FolioReferencia[]>(`${this.url}/obtenerFolioReferencia/${idFolio}`).toPromise();
  }
  async guardarFolioReferencia(FolioReferencia : FolioReferencia){
    return await this.http.post<FolioReferencia[]>(`${this.url}/crearFolioReferencia`,FolioReferencia).toPromise();
  }
  async eliminarFolioReferencia(idFolio : number){
    return await this.http.get<Boolean>(`${this.url}/eliminarFolioReferencia/${idFolio}`).toPromise();
  }
}
