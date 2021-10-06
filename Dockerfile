FROM node:lts-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

### prod ###
FROM nginx:alpine
# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# run nginx
CMD ["nginx", "-g", "daemon off;"]


#  --- LOCAL ---
# 1. docker build -f Dockerfile -t vue-bdc:v5 .
# 2. docker images
# 3. docker save -o d:/vue-bdc-v5.tar vue-bdc:v5
#  --- VPN ---
# 4. docker load -i ./vue-bdc-v5.tar
# 5. docker run -itd -p 30103:80 vue-bdc:v5
