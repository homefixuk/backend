docker run -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles
docker build -t nshah/node .
docker run -d --name dex1 -p 3000 --link mongo:mongo nshah/node