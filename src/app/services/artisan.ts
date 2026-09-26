import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Artisan {
  id: string;
  name: string;
  specialty: string;
  note: string;
  location: string;
  department: string;
  about: string;
  email: string;
  website: string;
  category: string;
  top: boolean;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtisanService {

  constructor(private http: HttpClient) {}

  getArtisans(): Observable<Artisan[]> {
    return this.http.get<Artisan[]>('data/datas.json');
  }

}