import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  recherche = '';

  // État du menu mobile : fermé par défaut
  menuOuvert = false;

  constructor(private router: Router) {}

  // Ouvrir ou fermer le menu mobile
  basculerMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  // Fermer le menu après avoir choisi un lien
  fermerMenu(): void {
    this.menuOuvert = false;
  }

  lancerRecherche(): void {
    const texte = this.recherche.trim();

    this.fermerMenu();

    this.router.navigate(['/artisans'], {
      queryParams: texte ? { recherche: texte } : {}
    });
  }

}