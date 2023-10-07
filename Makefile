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
	@docker compose -f docker-compose.dev.yml up --build