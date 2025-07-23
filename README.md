# Local Botnet

## Contents

- [Requirements](#requirements)
- [Ports](#ports)
- [Commands](#commands)
- [Additional information](#additional-information)
- [Environment variables](#environment-variables)

## Requirements

- Docker ^20.x
- docker-compose ^2.13.x

## Ports

- `3000` - App

### Commands

Root commands

```shell
# Launch docker containers
$: sh ./script/run.sh

# Launch docker containers
$: sh ./script/run-local.sh

# Open app container
$: docker exec -ti local-botnet-app bash
```

Docker commands

```shell
# Run app
$: yarn dev

# Build app
$: yarn build

# Preview app
$: yarn preview

# Check app errors
$: yarn check

# Lint app
$: yarn lint

# Format app files
$: yarn format
```

## Additional information

If you have access problem to volume files

```shell
$: sudo chown -R $USER ./
```

## Environment variables

`APP_PORT` - App port \
`APP_BASE_PATH` - App directory path
