VERSION = $(shell cat version)

all:
	sudo docker rmi dashboard-api:latest; sudo echo 0
	sudo docker build -t dashboard-api:$(VERSION) --no-cache=true .
	sudo docker tag -f dashboard-api:$(VERSION) dashboard-api:latest
	cd sidekiq
	sudo docker rmi sidekiq:latest; sudo echo 0
	sudo docker build -f sidekiq/Dockerfile -t sidekiq:$(VERSION) --no-cache=true .
	sudo docker tag -f sidekiq:$(VERSION) sidekiq:latest
