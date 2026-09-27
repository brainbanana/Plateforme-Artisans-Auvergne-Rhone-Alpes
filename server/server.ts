import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

const app = express();

const PORT = Number(process.env['PORT']) || 3000;

const estEnProduction = process.env['RENDER'] === 'true';

// Autoriser les requêtes provenant de notre application Angular et render
app.use(cors({
  origin: [ 
    'http://localhost:4200',
    'https://plateforme-artisans-auvergne-rhone-alpes.onrender.com'        
    ]
}));

// Autoriser le serveur à recevoir des données JSON
// Limiter la taille des requêtes à 10 Ko
app.use(express.json({
  limit: '10kb'
}));

// Configuration de MailDev
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  ignoreTLS: true
});

// Limiter les envois répétés vers les formulaires de contact
const limiteContact = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                // 10 requêtes par adresse IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Trop de demandes ont été envoyées. Veuillez réessayer dans 15 minutes.'
  }
});

// Vérifier qu'une valeur est un texte valide
// et que sa longueur respecte les limites autorisées

function texteValide(
  valeur: unknown,
  longueurMin: number,
  longueurMax: number
): valeur is string {

  return (
    typeof valeur === 'string' &&
    valeur.trim().length >= longueurMin &&
    valeur.trim().length <= longueurMax
  );

}

// Route de test du serveur
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Le serveur backend fonctionne correctement !'
  });
});

// Route de test de l'envoi d'un e-mail
app.get('/api/test-email', async (req, res) => {

  try {

    await transporter.sendMail({
      from: '"Plateforme Artisans" <test@plateforme-artisans.local>',
      to: 'artisan@test.local',
      subject: 'Test de connexion avec MailDev',
      text: 'Bonjour, ceci est un e-mail de test envoyé depuis notre serveur Node.js.'
    });

    res.json({
      message: 'E-mail de test envoyé avec succès à MailDev !'
    });

  } catch (error) {

    console.error(
      'Erreur lors de l’envoi de l’e-mail :',
      error
    );

    res.status(500).json({
      message: 'Erreur lors de l’envoi de l’e-mail.'
    });

  }

});

// Route de contact du formulaire de la page d'accueil
app.post('/api/contact/accueil', limiteContact, async (req, res) => {

  const {
    nom,
    email,
    telephone,
    categorie,
    lieu,
    objet,
    description
  } = req.body;

  
  // Vérifier les informations du formulaire d'accueil
  if (
    !texteValide(nom, 2, 100) ||
    !texteValide(email, 5, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !texteValide(categorie, 1, 100) ||
    !texteValide(lieu, 1, 100) ||
    !texteValide(objet, 1, 150) ||
    !texteValide(description, 10, 3000) ||
    (
      telephone !== undefined &&
      telephone !== '' &&
      !texteValide(telephone, 1, 30)
    )
  ) {
    res.status(400).json({
      message: 'Veuillez vérifier les informations du formulaire.'
    });
    return;
  }

  if (estEnProduction) {
    res.status(200).json ({
      message: 'Formulaire disponible en démonstration locale avec MailDev.'
    });
  }

  try {

    await transporter.sendMail({
      from: '"Plateforme Artisans" <test@plateforme-artisans.local>',
      to: 'demandes@test.local',
      replyTo: email,
      subject: 'Nouvelle demande depuis la page d’accueil',
      text: `
Nouvelle demande de contact

Nom : ${nom}
E-mail : ${email}
Téléphone : ${telephone || 'Non renseigné'}

Catégorie : ${categorie}
Lieu : ${lieu}
Objet : ${objet}

Description :
${description}
      `
    });

    res.status(200).json({
      message: 'Votre demande a bien été envoyée.'
    });

  } catch (error) {

    console.error(
      'Erreur lors de l’envoi de la demande :',
      error
    );

    res.status(500).json({
      message: 'Une erreur est survenue lors de l’envoi de la demande.'
    });

  }

});

// Route de contact du formulaire de la fiche artisan
app.post('/api/contact/artisan', limiteContact, async (req, res) => {

  const {
    artisanId,
    name,
    email,
    subject,
    message
  } = req.body ?? {};

  // Vérifier les informations du formulaire de contact artisan
  if (
    !texteValide(artisanId, 1, 100) ||
    !texteValide(name, 2, 100) ||
    !texteValide(email, 5, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !texteValide(subject, 1, 150) ||
    !texteValide(message, 10, 3000)
  ) {
    res.status(400).json({
      message: 'Veuillez vérifier les informations du formulaire.'
    });

    return;
  }

  if (estEnProduction) {
    res.status(200).json ({
      message: 'Formulaire disponible en démonstration locale avec MailDev.'
    });
  }

  try {

    // Envoyer la demande au serveur SMTP local de MailDev
    await transporter.sendMail({

      from: '"Plateforme Artisans" <test@plateforme-artisans.local>',

      to: 'artisan@test.local',

      replyTo: email,

      subject: 'Nouvelle demande de contact pour un artisan',

      text: `
Nouvelle demande de contact

Identifiant de l'artisan : ${artisanId}

Nom du demandeur : ${name}
Adresse e-mail : ${email}

Objet : ${subject}

Message :
${message}
      `

    });

    res.status(200).json({
      message: 'Votre demande a bien été envoyée.'
    });

  } catch (error) {

    console.error(
      'Erreur lors de l’envoi de la demande à l’artisan :',
      error
    );

    res.status(500).json({
      message: 'Une erreur est survenue lors de l’envoi de la demande.'
    });

  }

});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});