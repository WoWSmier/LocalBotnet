docker compose --project-name local-botnet down --volumes
docker compose --env-file ./environments/.env --file ./docker/docker-compose.yml --project-name local-botnet up --build --detach
docker exec local-botnet-app sh -c "yarn install --frozen-lockfile"
docker exec local-botnet-app sh -c "yarn build"
docker exec local-botnet-app sh -c "yarn preview"
