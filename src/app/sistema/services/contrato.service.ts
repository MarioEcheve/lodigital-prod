import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contrato } from '../model/Contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  url: string = `${environment.HOST}/contrato`;
  constructor(private http: HttpClient) { }

  async contratoByCompany(idEmpresa : number) : Promise<Contrato[]>{
    return this.http.get<Contrato[]>(`${this.url}/contratoByCompany/${idEmpresa}`).toPromise();
  }
  async save(contrato : Contrato) : Promise<Contrato>{
    return await this.http.post<Contrato>(`${this.url}/crearContrato`, contrato).toPromise();
  }
  async contratoById(idContrato : number) : Promise<Contrato>{
    return this.http.get<Contrato>(`${this.url}/contratoById/${idContrato}`).toPromise();
  }
}
