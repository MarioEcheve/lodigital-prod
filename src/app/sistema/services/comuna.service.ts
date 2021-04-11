import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Comuna } from '../model/comuna';
@Injectable({
  providedIn: 'root'
})
export class ComunaService {
  url: string = `${environment.HOST}/comuna`;
  constructor(private http: HttpClient) { }

  public comunas(idRegion : number){
    return this.http.get<Comuna>(`${this.url}/comunaPorRegion/${idRegion}`);
  }
}
