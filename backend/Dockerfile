# build
# note the consitency of building and running environments
FROM golang:buster as builder

WORKDIR /app

# cache mod packages
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

# build stripped binary by default
ARG BUILD_ARGS="-ldflags '-s -w'"
RUN go build -v $BUILD_ARGS -o backend

# ship
FROM debian:buster

WORKDIR /app

# to detect if mysql service is up
RUN apt-get -q update && apt-get -qy install netcat
COPY ./wait-for .

# only need config and compiled binary file
COPY ./config ./config
COPY --from=builder /app/backend .

# handle port exposure in docker compose

ENTRYPOINT ["/app/backend"]