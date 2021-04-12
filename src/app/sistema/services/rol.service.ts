import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Roles } from '../model/roles';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  url: string = `${environment.HOST}/rol`;
  constructor(private http: HttpClient) { }

  public roles(){
    return this.http.get<Roles>(`${this.url}`);
  }
}
