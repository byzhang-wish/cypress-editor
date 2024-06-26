SHELL = /bin/bash

SERVICE_NAME ?= cypress-editor

TAG := $(shell git rev-parse HEAD)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
DOCKER_REGISTRY ?= harbor.infra.wish-cn.com
IMAGE_NAMESPACE ?= wish
IMAGE_PROJECT_NAME ?= metersphere

IMAGE_FULL_TAG ?= $(DOCKER_REGISTRY)/$(IMAGE_NAMESPACE)/$(IMAGE_PROJECT_NAME)/$(SERVICE_NAME):$(TAG)

CHART_PATH ?= k8s/$(SERVICE_NAME)
RELEASE_NAME ?= $(SERVICE_NAME)
NAMESPACE ?= metersphere

build:
	docker build \
	-t $(IMAGE_FULL_TAG) -f Dockerfile .

push:
	docker push $(IMAGE_FULL_TAG)

test-deploy:
	helm upgrade --debug --install $(RELEASE_NAME) ./$(CHART_NAME) \
		--namespace $(NAMESPACE) \
		--set image.tag=$(TAG) \
		--set image.repository=$(DOCKER_REGISTRY)/$(IMAGE_NAMESPACE)/$(IMAGE_PROJECT_NAME)/$(SERVICE_NAME)

deploy:
	helm upgrade --install $(RELEASE_NAME) ./$(CHART_NAME) \
		--namespace $(NAMESPACE) \
		--set image.tag=$(TAG) \
		--set image.repository=your-docker-repo/cypress-editor
