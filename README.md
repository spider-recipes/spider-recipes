# Project
Project slogan.

## Sections
- [SQL Migrations instructions](#SQL-Migrations-instructions)
- [Postman](#Postman)
- [Run-instructions](#Run-instrutions)
- [Access the database using MS SQL Server studio](#database-access)

## SQL Migrations instructions
- upload your sql to the migrations folder as a new file with this naming convention V{year}{month}{day}{24hour}{min}__{description}.sql

## Postman
- Launch postman and import postman folder 

## Run-instructions
### Running Single Page Application Web app
```sh
cd app
npm install
npm run web
```
There is an option to decouple the two and host the static pages on an s3 bucket

## Access the database using MS SQL Server studio
- Open ms sql sever studio
- Set server type to database engine
- Insert {spider-recipes-db.cnsrxqmoyvuz.eu-west-1.rds.amazonaws.com} as the server name
- Select SQL sever authentication
- login as admin
- Password: 

## ERD Design

