# 📋 Task Manager

Application full-stack de gestion de tâches avec authentification multi-utilisateur, développée avec Angular et Spring Boot.

## 🚀 Démo en ligne

- **Application** : https://task-manager-frontend-itv7.onrender.com
- **API** : https://task-manager-backend-zi1w.onrender.com/api

> ⚠️ Le backend est hébergé sur un plan gratuit qui se met en veille après 15 minutes d'inactivité. Le premier chargement peut prendre 30 secondes à 1 minute le temps que le service redémarre.

## 📋 Fonctionnalités

- Inscription et connexion sécurisées (JWT)
- Chaque utilisateur gère ses propres tâches, de manière privée
- Création, modification, suppression et marquage "terminé" des tâches
- Validation des données côté backend et frontend
- Interface responsive avec notifications en temps réel

## 🛠️ Stack technique

**Backend**
- Java 17 / Spring Boot
- Spring Data JPA + Hibernate
- Spring Security + JWT (jjwt)
- PostgreSQL
- Maven

**Frontend**
- Angular (signals, architecture zoneless)
- Angular Material
- Reactive Forms
- RxJS

**Infrastructure**
- PostgreSQL hébergé sur Neon
- Backend et frontend déployés sur Render (Docker pour le backend)
- Git / GitHub

## 🏗️ Architecture

Ce repo est un monorepo contenant les deux applications :
task-manager/
├── task-manager-backend/ # API REST Spring Boot
└── task-manager-frontend/ # Application Angular


## 🔒 Sécurité

- Mots de passe hashés avec BCrypt (jamais stockés en clair)
- Authentification par token JWT (stateless)
- Chaque utilisateur ne peut accéder qu'à ses propres tâches (vérification d'ownership côté backend)
- Secrets et identifiants gérés via variables d'environnement, jamais commités dans le code

## 💻 Installation en local

**Prérequis** : Java 17+, Node.js, Angular CLI, PostgreSQL

**Backend**
```bash
cd task-manager-backend
# Configurer application.properties avec vos identifiants PostgreSQL locaux
./mvnw spring-boot:run
```

**Frontend**
```bash
cd task-manager-frontend
npm install
ng serve
```

L'application est alors accessible sur `http://localhost:4200`.

## 📝 Notes

Ce projet a été réalisé dans un cadre d'apprentissage, pour découvrir en profondeur Angular et Spring Boot : conception d'API REST, authentification, gestion d'état avec les signals, et déploiement en production.