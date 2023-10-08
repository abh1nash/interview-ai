APPS_DIR = apps
COMPONENTS_DIR = components

APPS = auth frontend interviews reports
COMPONENTS = token-service

prepare:
	@for app in $(APPS); do \
		echo "Preparing $$app..."; \
		(cd $(APPS_DIR)/$$app && npm install); \
	done
	@for component in $(COMPONENTS); do \
		echo "Preparing $$component..."; \
		(cd $(COMPONENTS_DIR)/$(COMPONENTS_DIT)/$$component && npm install); \
	done

	echo "Preparing integration test"
	cd tests-integration && npm install

unit-test:
	@for app in $(APPS); do \
		echo "Running unit tests for $$app..."; \
		(cd $(APPS_DIR)/$$app && npm run test); \
	done
	@for component in $(COMPONENTS); do \
		echo "Running unit tests for $$component..."; \
		(cd $(COMPONENTS_DIR)/$(COMPONENTS_DIT)/$$component && npm run test); \
	done

dev:
	@docker compose --env-file .env -f docker-compose.base.yml -f docker-compose.dev.yml up --build

test:
	@docker compose -p interview-ai-test --env-file .env -f docker-compose.base.yml -f docker-compose.test.yml up --build -d

teardown-test:
	@docker compose -p interview-ai-test down -v --remove-orphans

integration-test:
	@echo "Running integration tests..."
	@make test
	@cd tests-integration && npm run test
	@make teardown-test

prod:
	@docker compose -f docker-compose.base.yml -f docker-compose.yml up --build -d