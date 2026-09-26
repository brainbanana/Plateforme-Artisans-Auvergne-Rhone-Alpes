
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Données du formulaire de la page d'accueil
export interface DemandeAccueil {
  nom: string;
  email: string;
  telephone: string;
  categorie: string;
  lieu: string;
  objet: string;
  description: string;
}

// Données du formulaire de la fiche artisan
export interface DemandeArtisan {
  artisanId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Réponse du serveur backend
export interface ReponseContact {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api';

  // Envoi du formulaire de la page d'accueil
  envoyerDemandeAccueil(
    demande: DemandeAccueil
  ): Observable<ReponseContact> {

    return this.http.post<ReponseContact>(
      `${this.apiUrl}/contact/accueil`,
      demande
    );

  }

  // Envoi du formulaire de la fiche artisan
  envoyerDemandeArtisan(
    demande: DemandeArtisan
  ): Observable<ReponseContact> {

    return this.http.post<ReponseContact>(
      `${this.apiUrl}/contact/artisan`,
      demande
    );

  }

}