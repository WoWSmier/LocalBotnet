docker compose --project-name local-botnet down --volumes
docker compose --env-file ./environments/.env.local --file ./docker/docker-compose.yml --project-name local-botnet up --build --detach
docker exec local-botnet-app sh -c "yarn install --frozen-lockfile"
