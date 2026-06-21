.PHONY: dev-up dev-down migrate seed test

dev-up:
	docker compose -f infra/docker-compose.dev.yml up -d

dev-down:
	docker compose -f infra/docker-compose.dev.yml down

migrate:
	npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

seed:
	npm --workspace apps/api run prisma:seed

test:
	npm test
