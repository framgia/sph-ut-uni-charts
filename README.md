# Uni-Chart


## FE Setup
```bash
cd fe
yarn install
```


## Docker Setup
Note: _If docker is not yet installed in your machine, please install it first._
Then, run the following commands:

```bash
cd docker
sudo docker-compose up
```

<br />

## Backend For Frontend (BFF)
Go to the bff directory and add .env file in the root directory with the following values below:
```bash
PORT=11000
BACKLOG_API_SERVICE=http://localhost:12000/api
CLOCKIFY_API_SERVICE=http://localhost:13000/api
ACCOUNT_API_SERVICE=http://localhost:14000/api
```

Run the following commands:

```bash
cd bff
npm install
npm run dev
```

<br />

## Account Service
Go to the account directory and add .env file in the root directory with the following values below:
```bash
PORT=14000
TOKEN_KEY=test
DATABASE_URL="postgresql://capstone:capstone@localhost:5432/account?schema=public"
```
Run the following commands:
```bash
cd account
npm install
npm run dev
npx prisma migrate dev
npx prisma studio
```

<br />
<br />

## Backlog Service
Go to the backlog directory and add .env file in the root directory with the following values below:
```bash
PORT=12000
DATABASE_URL="postgresql://capstone:capstone@localhost:5432/backlog?schema=public"
```
Run the following commands:
```bash
cd backlog
npm install
npm run dev
npx prisma migrate dev
npx prisma studio
```

<br />

## Clockify Service
Go to the clockify directory and add .env file in the root directory with the following values below:
```bash
PORT=13000
DATABASE_URL="postgresql://capstone:capstone@localhost:5432/clockify?schema=public"
```
Run the following commands:
```bash
cd clockify
npm install
npm run dev
npx prisma migrate dev
npx prisma studio
```

<br />

## Development Flow Chart
Google Drive: https://drive.google.com/file/d/1BkmTChuuscGnAqj-hwWd6vUKUNEqlC8E/view?usp=sharing
