docker stop rocket-framework
docker rm rocket-framework
docker image rm rocket-framework:1.0
docker build -t rocket-framework:1.0 .
docker run --name rocket-framework -d -v rocket-framework-volume:/app/files -p 7001:5000 rocket-framework:1.0
