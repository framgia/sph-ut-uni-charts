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

## Development Flow Chart

Google Drive: https://drive.google.com/file/d/1BkmTChuuscGnAqj-hwWd6vUKUNEqlC8E/view?usp=sharing
