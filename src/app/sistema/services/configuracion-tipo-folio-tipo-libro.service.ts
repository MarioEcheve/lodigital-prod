import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConfiguracionTipoFolioTipoLibro } from '../model/ConfiguracionTipoFolioTipoLibro';
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionTipoFolioTipoLibroService {
  url: string = `${environment.HOST}/configuracionTipoFolioTipoLibro`;
  constructor(private http: HttpClient) { }

  async listar() : Promise<ConfiguracionTipoFolioTipoLibro[]>{
    return await this.http.get<ConfiguracionTipoFolioTipoLibro[]>(`${this.url}`).toPromise();
  }
}
