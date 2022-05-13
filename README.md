# Uni-Chart

## SETUP ENV
FE
```
NEXT_PUBLIC_BFF_API=http://localhost:11000/api/
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<GOOGLEID>
```

BFF
```
PORT=11000
BACKLOG_API_SERVICE=http://backlog:12000/api
CLOCKIFY_API_SERVICE=http://clockify:13000/api
ACCOUNT_API_SERVICE=http://account:14000/api
```

ACCOUNT
```
PORT=14000
DATABASE_URL="postgresql://capstone:capstone@postgres:5432/account?schema=public"
```

BACKLOG
```
PORT=12000
DATABASE_URL="postgresql://capstone:capstone@postgres:5432/backlog?schema=public"
BACKLOG_HOST=https://framgiaph.backlog.com
```

CLOCKIFY
```
PORT=13000
DATABASE_URL="postgresql://capstone:capstone@postgres:5432/clockify?schema=public"
```


## Build the Docker Environment

```
docker-compose up --build -d
```

## Run All Services

To run all run service just run this one

```
docker-compose start -d || docker compose up -d
```

To shutdown all service run this one

```
docker-compose down
```

To shutdown specific service just run this one

```
docker-compose stop <SERVICE>
```

## Checking Logs

```
docker-compose logs -f
```

Check logs on specific service

```
docker-compose logs -f <SERVICE>
```

## Using Prisma Studio on each Service

Just run this command to use prisma studio

### All Service

```
docker-compose exec <SERVICE> yarn prisma studio
```

Visit the prisma studio according to the service port

```
bff:     5551
account: 5552
backlog: 5553
clockify:5554
```

## Development Flow Chart

Google Drive: https://drive.google.com/file/d/1BkmTChuuscGnAqj-hwWd6vUKUNEqlC8E/view?usp=sharing
