.ONESHELL:
SHELL          := bash
.SHELLFLAGS    := -eu -o pipefail -c
.DEFAULT_GOAL  := help

.PHONY: *

run: ## Run the web app
	@npm start

debug: clean ## Run the web app in debug mode
	@DEBUG=myapp:* npm start

deps: ## Install/update dependencies using NPM
	@npm install

help: ## Prints this help message
	@echo "Available targets:"
	COLOR_ON=$$(tput setaf 3)
	COLOR_OFF=$$(tput sgr0)
	grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk "BEGIN {FS = \":.*?## \"}; {printf \"$${COLOR_ON}%-30s$${COLOR_OFF} %s\n\", \$$1, \$$2}"
