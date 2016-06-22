docker run -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles

docker build -t nshah/node .

docker run -d --name dex1 -p 3000 --link mongo:mongo -e "NODE_ENV=DEV" nshah/node
docker run -d --name dex2 -p 3000 --link mongo:mongo -e "NODE_ENV=INT" nshah/node


docker run -d -p 80:80 --link dex1:dex1,dex2:dex2 --name nginx nshah/nginx