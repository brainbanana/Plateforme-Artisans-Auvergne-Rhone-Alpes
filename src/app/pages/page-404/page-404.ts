import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-page-404',
  imports: [RouterLink],
  templateUrl: './page-404.html',
  styleUrl: './page-404.scss'
})
export class Page404 implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {

    // Titre de la page 404
    this.titleService.setTitle(
      'Page introuvable | Artisans Auvergne-Rhône-Alpes'
    );

    // Description de la page 404
    this.metaService.updateTag({
      name: 'description',
      content: "Cette page est introuvable. Retournez à l'accueil pour découvrir les artisans d'Auvergne-Rhône-Alpes."
    });

    // Demander aux moteurs de recherche de ne pas indexer cette page
    this.metaService.updateTag({
      name: 'robots',
      content: 'noindex, follow'
    });

  }

}