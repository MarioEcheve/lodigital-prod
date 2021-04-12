import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EstadoServicioContrato } from '../model/estadoServicioContrato';

@Injectable({
  providedIn: 'root'
})
export class EstadoServicioContratoService {

  url: string = `${environment.HOST}/estadoServicioContrato`;
  constructor(private http: HttpClient) { }
  
  async buscarEstadoServicioContrato(){
    return await this.http.get<EstadoServicioContrato[]>(`${this.url}`).toPromise();
  }
}
