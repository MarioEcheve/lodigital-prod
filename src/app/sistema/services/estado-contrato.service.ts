import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EstadoContrato } from '../model/estadoContrato';

@Injectable({
  providedIn: 'root'
})
export class EstadoContratoService {
  url: string = `${environment.HOST}/estadoContrato`;
  constructor(private http: HttpClient) { }

  public async estadosContrato(){
    return await this.http.get<EstadoContrato[]>(this.url).toPromise();
  }
}
