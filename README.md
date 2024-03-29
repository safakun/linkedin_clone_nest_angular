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
``` 

http://localhost:3000/api 

- adding modules

```bash
nest g mo feed
nest g s feed/serbices/feed --flat --no-spec
nest g co feed/controllers/feed --flat --no-spec
``` 

