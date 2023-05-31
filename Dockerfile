FROM node:18.12.1-alpine as dependency_stage

# Deps stage
WORKDIR /app
COPY package.json /app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN yarn install --loglevel=warn

# Build stage
FROM node:18.12.1-alpine as build_stage
WORKDIR /app
COPY --from=dependency_stage /app/node_modules /app/node_modules
COPY ./apps/api /app/apps/api
COPY ./libs /app/libs
COPY package.json /app
COPY package.json /app
COPY ./tsconfig.base.json /app
COPY ./nx.json /app
RUN yarn build

# Run stage
FROM node:18.12.1-alpine as run_stage
WORKDIR /app
COPY --from=build_stage /app/dist /app/dist
COPY --from=build_stage /app/node_modules /app/node_modules
COPY .env /app
COPY ./credentials.json /app
COPY ./token.json /app

EXPOSE 4001

CMD ["node", "dist/apps/api/main.js"]