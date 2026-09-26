import { Component, OnInit, ChangeDetectorRef ,inject } from '@angular/core';
import { Artisan, ArtisanService } from '../../services/artisan';
import { Router, RouterLink } from '@angular/router';
import { CommentTrouver } from '../../components/comment-trouver/comment-trouver';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink, CommentTrouver, FormsModule, ReactiveFormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss'
})

export class Accueil implements OnInit {

  artisansDuMois: Artisan[] = [];
  departements: string[] = [];
  villes: string[] = [];
  metiersDisponibles: string[] = [];
  tousLesArtisansAccueil: Artisan[] = [];
  lieuSelectionne = '';
  categorieSelectionnee = '';

  formulaireDemandeVisible = false;

  demandeEnvoyee = false;
  erreurEnvoi = false;
  envoiEnCours = false;
  limiteEnvoisAtteinte = false; 

  private fb = inject(FormBuilder);

  formulaireDemande = this.fb.nonNullable.group ({
    nom: ['', [
    Validators.required,
    Validators.minLength(2)
    ]],

    email: ['', [
    Validators.required,
    Validators.email
    ]],

    telephone: [''],

    categorie: ['', Validators.required],

    lieu: ['', Validators.required],

    objet: ['', Validators.required],

    description: ['', [
    Validators.required,
    Validators.minLength(10)
    ]]

  });

  constructor(
    private artisanService: ArtisanService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private contactService: ContactService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  rechercherParLieu(): void {
    if (!this.lieuSelectionne) {
      return;
    }
    const [type, lieu] = this.lieuSelectionne.split(':');
    if (type === 'departement') {
      this.router.navigate(['/artisans'],{
        queryParams: { departement: lieu }
      });

    } else if (type === 'ville') {
      this.router.navigate(['/artisans'], {
        queryParams: { ville: lieu }
      });
    }
  }

  afficherMetiers(categorie: string): void {
    if (this.categorieSelectionnee === categorie) {
      this.categorieSelectionnee = '';
      this.metiersDisponibles = [];
      return;
    }

    this.categorieSelectionnee = categorie;
    
    this.metiersDisponibles = [...new Set (
      this.tousLesArtisansAccueil
        .filter(artisan => artisan.category === categorie)
        .map(artisan => artisan.specialty)
    )].sort((a, b) => a.localeCompare(b, 'fr'));  
    
  }

  rechercherParMetier(metier: string): void {
    this.router.navigate(['/artisans'], {
      queryParams: { metier: metier }
    });
  }

  afficherFormulaireDemande(): void {
    this.formulaireDemandeVisible = !this.formulaireDemandeVisible;
  }

  
  envoyerDemande(): void {

    if (this.envoiEnCours) {
      return;
    }

    this.demandeEnvoyee = false;
    this.erreurEnvoi = false;
    this.limiteEnvoisAtteinte = false;

    // Vérifier les champs du formulaire
    if (this.formulaireDemande.invalid) {
      this.formulaireDemande.markAllAsTouched();
      return;
    }

    // Récupérer les informations du formulaire
    const demande = this.formulaireDemande.getRawValue();

    this.envoiEnCours = true;

    // Envoyer la demande au serveur backend
    this.contactService.envoyerDemandeAccueil(demande).subscribe({

    next: () => {

      this.envoiEnCours = false;
      this.demandeEnvoyee = true;

      // Réinitialiser le formulaire après un envoi réussi
      this.formulaireDemande.reset();

      this.cdr.detectChanges();

    },

    error: (erreur) => {

      console.error(
        'Erreur lors de l’envoi de la demande :',
        erreur
      );

      this.envoiEnCours = false;

      if (erreur.status === 429) {
        this.limiteEnvoisAtteinte = true;
      } else {
        this.erreurEnvoi = true;
      }

      this.cdr.detectChanges();

    }

  });

}

  ngOnInit(): void {

    // SEO de la page d'accueil
    this.titleService.setTitle (
      'Artisans en Auvergne-Rhône-Alpes | Trouvez un artisan près de chez vous'
    ),
    this.metaService.updateTag ({
      name: 'description',
      content: "Découvrez les artisans d'Auvergne-Rhône-Alpes. Recherchez un professionnel par métier ou par localisation, consultez sa fiche et contactez-le directement."
    });
    
    // Chargement des artisans

    this.artisanService.getArtisans().subscribe({

      next: (artisans) => {

       // Récupérer les artisans du mois
        this.tousLesArtisansAccueil = artisans;
        this.artisansDuMois = artisans.filter(
          artisan => artisan.top === true
        );

       // Récupérer les départements sans doublons
        this.departements = [...new Set(
          artisans.map(artisan => artisan.department)
        )].sort((a, b) => a.localeCompare(b, 'fr'));

       // Récupérer les villes sans doublons
        this.villes = [...new Set(
          artisans.map(artisan => artisan.location)
        )].sort((a, b) => a.localeCompare(b, 'fr'));

        this.cdr.detectChanges();

      },

      error: (erreur) => {
        console.error(
          'Erreur lors du chargement des artisans :',
          erreur
        );
      }

    });

  }

}