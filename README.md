
# RabbitMQ Messaging App
 
Ce projet est une application de chat en temps réel utilisant Socket.IO, Express et RabbitMQ.


## Prérequis 


- Node.js
- npm
- Docker 
- Rabbitmq

## Installation

1. Clonez ce dépôt sur votre machine locale :
    ```bash
    git clone https://github.com/djah97123/rabbitmq-messaging.git
    ```

2. Accédez au dossier du projet :
    ```bash
    cd rabbitmq-messaging
    ```
3. Installez les dépendances du projet :
    ```bash
    npm install
    ```

4. Lancez RabbitMQ avec Docker :
    ```bash
    docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
    ```

## Utilisation

Pour démarrer le serveur, exécutez la commande suivante :
```bash
node server.js
```
Le serveur démarrera et écoutera sur le port 3000. Vous pouvez accéder à l'application de chat en ouvrant votre navigateur et en allant à [http://localhost:3000](http://localhost:3000).


## Fonctionnalités

- Enregistrement et connexion des utilisateurs.
- Envoi et réception de messages en temps réel.
- Les messages sont envoyés à RabbitMQ, puis consommés et envoyés à tous les clients connectés.


## Contribution

Ce projet à été réalisé par Djahnick Gene , Elvis Cabral , Nathaniel Anton et Hamza Bella


## Architecture arm-64

Si vous utiliser un mac avec une puce M1/M2 il est possible que vous rencontriez un problème liè a sqlite3. 
Si cela arrive il suffit de désinstaller sqlite avec la commande :

```bash
npm uninstall sqlite3
```
Ensuite installer celui-ci :

```bash
npm install sqlite3 --target_arch=arm64
```

Finalement relancer le serveur. 

