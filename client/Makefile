VERSION = $(shell node -pe "require('./package.json').version")

production:
	npm install
	npm run deploy-production
	sudo docker rmi dashboard:latest; sudo echo 0
	sudo docker build -t dashboard:$(VERSION) --no-cache=true .
	sudo docker tag -f dashboard:$(VERSION) dashboard:latest


staging:
	npm install
	npm run deploy-staging
	sudo docker rmi dashboard:latest; sudo echo 0
	sudo docker build -t dashboard:$(VERSION) --no-cache=true .
	sudo docker tag -f dashboard:$(VERSION) dashboard:latest
