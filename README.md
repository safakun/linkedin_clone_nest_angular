# Linkedin clone Nest + Angular

https://www.youtube.com/playlist?list=PL9_OU-1M9E_ut3NA04C4eHZuuAFQOUwT0 


```bash
npm i -g @nestjs/cli 
nest new api
cd api

npm i @nestjs/typeorm typeorm pg @nestjs/config
``` 

.env file postgres credentials
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DATABASE=postgres
JWT_SECRET=jwtSecret_phrase
``` 

http://localhost:3000/api 

- adding modules

```bash
nest g mo feed
nest g s feed/serbices/feed --flat --no-spec
nest g co feed/controllers/feed --flat --no-spec
``` 

```bash
docker compose up
npm run start:dev
```


### Frontend Angular with Ionic
https://ionicframework.com/ 

```bash
npm i -g @ionic/cli
ionic start
```
choose Angular 

name linkedin

blank project

Integrate your new app with Capacitor to target native Ios and Android? - Yes 

```bash
cd linkedin
ionic serve
``` 
http://localhost:8100 

- generate component
```bash
ionic generate component home/components/header 

ionic generate component home/components/header/popover

ionic generate component home/components/profile-summary 

ionic generate component home/components/start-post

ionic generate component home/components/advertising

ionic generate component home/components/start-post/modal

ionic generate component home/components/all-posts

ionic generate service home/services/post

ionic generate component home/components/tabs


ionic generate page auth
``` 

in tsconfig.json add
"strictPropertyInitialization": false 

- unlimited posts selection uRL
GET http://localhost:3000/api/feed?take=4&skip=2 

- Installing authentifivation on Nest
```bash
npm i passport passport-jwt @nestjs/passport @nestjs/jwt bcrypt

npm i -D @types/passport-jwt @types/bcrypt
``` 

- generate auth module
```bash
nest g mo auth 

nest g s auth/services/auth --no-spec --flat

nest g co auth/controllers/auth --no-spec --flat

nest g gu auth/guards/jwt --no-spec --flat

nest g d auth/decorators/roles --flat --no-spec 

nest g gu auth/guards/roles --flat --no-spec


ionic g s auth/services/auth --skip-tests

ionic g guard auth/guards/auth --skip-tests

# On client side angular
npm i jwt-decode

# npm install --save @capacitor/core @capacitor/cli

npm i @capacitor/preferences
``` 
use CanLoad while generating such guard 


```bash
nest g gu feed/guards/is-creator --flat --no-spec 

ionic g s auth/services/auth-interceptor --skip-tests
``` 

Image upload on nest

```bash
npm i -D @types/multer 
npm i uuid file-type


nest g s auth/services/user --flat --no-spec

nest g co auth/controllers/user --flat --no-spec 
```

```bash
ionic g c home/components/connection-profile
ionic g s home/services/connection-profile
ionic g s home/services/banner-color

ionic g c home/components/user-profile

ionic g c home/components/header/friend-requests-popover
``` 


### How to upgrade Nest, Ionic and Angular 

```bash
npm install -g npm-check-updates 

npm install -g @nestjs/cli 

npm outdated

nest update -t -t latest 
# To upgrade all packages to latest:
ncu -u 

# On client
npm i -g @ionic/cli 
npm i -g @angular/cli 
ncu -u

npm i @capacitor/storage
npm i @capacitor/splash-screen

``` 

- On backend
```bash
npm i morgan
npm i class-validator class-transformer
``` 

### Testing Nest backend

```bash
npm i -D node-mocks-http 

npm run test

npm run test feed.controller
npm run test feed.service

npm run test:e2e
```

- Nest websockets
https://docs.nestjs.com/websockets/gateways
```bash
npm i --save @nestjs/websockets @nestjs/platform-socket.io

nest g mo chat
```

- create gateway for chat 
```bash
nest g ga chat/gateway/chat --no-spec 
``` 

- on client
```bash
npm i ngx-socket-io

ionic g c home/components/chat 

ionic g s home/services/chat

```

```bash
nest g s chat/services/conversation --no-spec --flat 

```