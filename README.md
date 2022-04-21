# Uni-Chart

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
