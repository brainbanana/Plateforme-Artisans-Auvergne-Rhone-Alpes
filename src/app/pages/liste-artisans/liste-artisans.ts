import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component,OnInit, ChangeDetectorRef } from '@angular/core';
import { Artisan, ArtisanService } from '../../services/artisan';
import { CommentTrouver } from '../../components/comment-trouver/comment-trouver';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-liste-artisans',
  imports: [RouterLink, CommentTrouver],
  templateUrl: './liste-artisans.html',
  styleUrl: './liste-artisans.scss'
})
export class ListeArtisans implements OnInit {

  artisans: Artisan[] = [];
  tousLesArtisans: Artisan[] = [];

  recherche = '';
  categorie = '';

  departement = '';
  ville = '';

  metier = '';

  constructor(
    private artisanService: ArtisanService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private metaService: Meta
  ) {}

  filtrerArtisans(): void {

    const recherche = this.recherche.trim().toLocaleLowerCase('fr');
    const categorie = this.categorie.trim().toLocaleLowerCase('fr');

    const departement = this.departement.trim().toLocaleLowerCase('fr');
    const ville = this.ville.trim().toLocaleLowerCase('fr');

    const metier = this.metier.trim().toLocaleLowerCase('fr');

    this.artisans = this.tousLesArtisans.filter(artisan => {

      // Vérifier la catégorie de l'artisan

      const correspondCategorie =
        !categorie ||
        artisan.category.toLocaleLowerCase('fr') === categorie;

      // Vérifier le nom, la spécialité et la ville

      const correspondRecherche =
        !recherche ||
        artisan.name.toLocaleLowerCase('fr').includes(recherche) ||
        artisan.specialty.toLocaleLowerCase('fr').includes(recherche) ||
        artisan.location.toLocaleLowerCase('fr').includes(recherche);

        // Filtrer par département
      const correspondDepartement =
        !departement ||
        artisan.department.toLocaleLowerCase('fr') === departement;

        // Filtrer par ville
      const correspondVille =
        !ville ||
        artisan.location.toLocaleLowerCase('fr') === ville;

      const correspondMetier =
        !metier ||
        artisan.specialty.toLocaleLowerCase('fr') === metier;

      return (
        correspondCategorie &&
        correspondRecherche &&
        correspondDepartement &&
        correspondVille &&
        correspondMetier
      );  

    });
    
  }

  ngOnInit(): void {

    // SEO de la page Liste des artisans
    this.titleService.setTitle (
      'Liste des artisans en Auvergne-Rhône-Alpes | Trouvez votre professionnel'
    ),
    this.metaService.updateTag ({
      name: 'description',
      content: "Consultez la liste des artisans d'Auvergne-Rhône-Alpes. Recherchez un professionnel par métier, catégorie, ville ou département et découvrez sa fiche."
    })

    // Récupérer le texte recherché dans l'URL

    this.route.queryParamMap.subscribe(params => {

      this.recherche = params.get('recherche') ?? '';

      this.categorie = params.get('categorie') ?? '';

      this.departement = params.get('departement') ?? '';

      this.ville = params.get('ville') ?? '';

      this.metier = params.get('metier') ?? '';

      this.filtrerArtisans();

      this.cdr.detectChanges();

    });

    // Charger les artisans depuis le service
    
    this.artisanService.getArtisans().subscribe({

      next: (artisans) => {

        this.tousLesArtisans = artisans;

        this.filtrerArtisans();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement des artisans :',
          error
      );

    }

  });

}

}