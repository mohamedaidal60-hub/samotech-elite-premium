# Guide de Déploiement — SamoTech Elite

Suivez ces étapes pour mettre votre plateforme en ligne avec Neon, GitHub et Vercel.

## 1. Configuration de la Base de Données (Neon)
1. Connectez-vous à votre console [Neon.tech](https://neon.tech).
2. Ouvrez l'onglet **SQL Editor**.
3. Copiez le contenu du fichier `full_schema_neon.sql` (présent à la racine du projet).
4. Collez-le dans l'éditeur et cliquez sur **Run**.
5. Votre base de données est maintenant prête avec toutes les tables et les packs par défaut.

## 2. Configuration des Emails (Resend)
1. Créez un compte sur [Resend.com](https://resend.com).
2. Allez dans **API Keys** et créez une nouvelle clé.
3. Copiez cette clé et mettez-la dans votre fichier `.env` :
   `VITE_RESEND_API_KEY="votre_cle_ici"`
4. (Optionnel) Configurez votre domaine sur Resend pour envoyer des emails depuis `@votre-domaine.com`.

## 3. Test en Local
Pour tester le site sur votre ordinateur avant de le publier :
1. Ouvrez un terminal dans le dossier du projet.
2. Tapez : `npm run dev`
3. Ouvrez le lien qui s'affiche (généralement `http://localhost:5173`).

## 4. Pousser sur GitHub
1. Créez un nouveau dépôt vide sur votre compte GitHub.
2. Dans votre terminal, exécutez :
   ```bash
   git init
   git add .
   git commit -m "Déploiement SamoTech Elite"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM/VOTRE_REPO.git
   git push -u origin main
   ```

## 5. Déploiement sur Vercel
1. Allez sur [Vercel.com](https://vercel.com) et cliquez sur **Add New > Project**.
2. Importez votre dépôt GitHub.
3. Dans la section **Environment Variables**, ajoutez TOUTES les variables présentes dans votre fichier `.env` :
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `VITE_RESEND_API_KEY`
4. Cliquez sur **Deploy**.

Une fois terminé, votre site sera en ligne et connecté à votre base de données Neon !
