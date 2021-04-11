import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Region } from '../model/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  url: string = `${environment.HOST}/region`;
  constructor(private http: HttpClient) { }

  public regiones(){
    return this.http.get<Region>(`${this.url}`);
  }
}
