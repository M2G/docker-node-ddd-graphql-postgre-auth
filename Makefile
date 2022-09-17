tutorial:
	@# todo: have this actually run some kind of tutorial wizard?
	@echo "Please read the 'Makefile' file to go through this tutorial"

start:
	docker-compose -f docker-compose.yml up

test:
	docker-compose -f docker-compose.test.yml up --build

build:
	docker-compose -f docker-compose.yml up --build

build-nocache:
	docker-compose build --no-cache

stop:
	docker rm -f $(docker ps -aq)

rm-images:
	docker rmi -f $(docker images -aq)

volume-prune:
	docker volume prune

systeme-prune:
	docker system prune -a

stop-container:
	docker container stop $(docker container ls -aq)

rm-container:
	docker container rm $(docker container ls -aq)
