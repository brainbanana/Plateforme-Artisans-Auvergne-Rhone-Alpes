import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artisan, ArtisanService } from '../../services/artisan';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-fiche-artisan',
  imports: [FormsModule],
  templateUrl: './fiche-artisan.html',
  styleUrl: './fiche-artisan.scss'
})

export class FicheArtisan implements OnInit {

  artisanId: string | null = null;

  artisan: Artisan | undefined;

  // Le formulaire est masqué à l'ouverture de la fiche

  formulaireVisible = false;

  // Données du formulaire de contact

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  messageEnvoye = false;
  messageErreur = false;

  envoiEnCours = false;
  erreurEnvoi = false;
  limiteEnvoisAtteinte = false;

  constructor(
    private route: ActivatedRoute,
    private artisanService: ArtisanService,
    private cdr: ChangeDetectorRef,
    private contactService: ContactService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  // Récupération des informations de l'artisan

  ngOnInit(): void {

    this.artisanId = this.route.snapshot.paramMap.get('id');

    this.artisanService.getArtisans().subscribe({

      next: (artisans) => {

        this.artisan = artisans.find(
          artisan => artisan.id === this.artisanId
        );

        // SEO dynamique de la fiche artisan
        if (this.artisan) {
          this.titleService.setTitle(
            `${this.artisan.name} - ${this.artisan.specialty} à ${this.artisan.location} | Artisans Auvergne-Rhône-Alpes`
          );
          this.metaService.updateTag ({
            name: 'description',
            content: `Découvrez ${this.artisan.name}, ${this.artisan.specialty} à ${this.artisan.location}, en Auvergne-Rhône-Alpes. Consultez sa fiche et contactez cet artisan directement.`
          });
        } else {
          // Éviter de conserver le titre d'un autre artisan si l'identifiant est inconnu
          this.titleService.setTitle (
            'Artisan introuvable | Artisans Auvergne-Rhône-Alpes'
          );
          this.metaService.updateTag ({
            name: 'description',
            content: "La fiche de cet artisan est introuvable. Consultez la liste des artisans d'Auvergne-Rhône-Alpes."
          });
        }

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement de la fiche artisan :',
          error
        );

      }

    });

  }

  // Afficher le formulaire au clic sur le bouton

  afficherFormulaire(): void {
    this.formulaireVisible = true;

    // Afficher le formulaire avant de faire défiler la page

    this.cdr.detectChanges();

    document.getElementById('contact-artisan')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });  
  }

  
  onSubmit(): void {

    // Empêcher les envois multiples
    if (this.envoiEnCours) {
      return;
    }

    // Réinitialiser les messages
    this.messageEnvoye = false;
    this.messageErreur = false;
    this.erreurEnvoi = false;
    this.limiteEnvoisAtteinte = false;

    // Vérifier les champs du formulaire
    if (
      !this.contactForm.name.trim() ||
      !this.contactForm.email.trim() ||
      !this.contactForm.subject.trim() ||
      !this.contactForm.message.trim()
    ) {

      this.messageErreur = true;
      return;

    }

    // Vérifier que l'artisan est identifié
    if (!this.artisanId || !this.artisan) {

      this.erreurEnvoi = true;
      return;

    }

    // Préparer les données à envoyer au serveur
    const demande = {
      artisanId: this.artisanId,
      name: this.contactForm.name,
      email: this.contactForm.email,
      subject: this.contactForm.subject,
      message: this.contactForm.message
    };

    this.envoiEnCours = true;

    // Envoyer la demande au serveur backend
    this.contactService.envoyerDemandeArtisan(demande).subscribe({

      next: () => {

        this.envoiEnCours = false;
        this.messageEnvoye = true;

        // Réinitialiser les champs après un envoi réussi
        this.contactForm = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };

        this.cdr.detectChanges();

      },

      error: (erreur) => {

        console.error(
         'Erreur lors de l’envoi de la demande à l’artisan :',
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
}