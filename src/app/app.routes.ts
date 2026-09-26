import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { ListeArtisans } from './pages/liste-artisans/liste-artisans';
import { FicheArtisan } from './pages/fiche-artisan/fiche-artisan';
import { MentionsLegales } from './pages/mentions-legales/mentions-legales';
import { DonneesPersonnelles } from './pages/donnees-personnelles/donnees-personnelles';
import { Accessibilite } from './pages/accessibilite/accessibilite';
import { Cookies } from './pages/cookies/cookies';
import { Page404 } from './pages/page-404/page-404';

export const routes: Routes = [
  {
    path: '',
    component: Accueil
  },
  {
    path: 'artisans',
    component: ListeArtisans
  },
  {
    path: 'artisan/:id',
    component: FicheArtisan
  },
  {
    path: 'mentions-legales',
    component: MentionsLegales
  },
  {
    path: 'donnees-personnelles',
    component: DonneesPersonnelles
  },
  {
    path: 'accessibilite',
    component: Accessibilite
  },
  {
    path: 'cookies',
    component: Cookies
  },
  {
    path: '**',
    component: Page404
  }
];