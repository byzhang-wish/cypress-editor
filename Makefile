SHELL = /bin/bash

SERVICE_NAME ?= cypress-editor

TAG := $(shell git rev-parse HEAD)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
DOCKER_REGISTRY ?= harbor.infra.wish-cn.com
IMAGE_NAMESPACE ?= wish
IMAGE_PROJECT_NAME ?= cypress
CHART_NAME ?= $(SERVICE_NAME)

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
	helm upgrade --debug --install $(RELEASE_NAME) k8s/$(CHART_NAME) \
		--namespace $(NAMESPACE) \
		--set image.tag=$(TAG) \
		--set image.repository=$(DOCKER_REGISTRY)/$(IMAGE_NAMESPACE)/$(IMAGE_PROJECT_NAME)/$(SERVICE_NAME)

deploy:
	helm upgrade --install $(RELEASE_NAME) k8s/$(CHART_NAME) \
		--namespace $(NAMESPACE) \
		--set image.tag=$(TAG) \
		--set image.repository=$(DOCKER_REGISTRY)/$(IMAGE_NAMESPACE)/$(IMAGE_PROJECT_NAME)/$(SERVICE_NAME)


docker-start:
	docker run -d --rm --name $(SERVICE_NAME) -p 8080:8080 $(IMAGE_FULL_TAG) 

docker-stop:
	docker stop $(SERVICE_NAME) && docker rm $(SERVICE_NAME)

