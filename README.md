# haproxy-api

*haproxy-api* provides a Javascript-native ReSTful interface to the "stats" socket of HAProxy.
 
It uses the [haproxy-sdk](https://github.com/jackpinetech/haproxy-sdk) Javascript library to interact with HAProxy and run all commands. 

# Features

* HAProxy in multi-process mode (`nbproc` >1)
* UNIX stats socket, no support for querying HTTP statistics page
* Frontend operations
* Backend operations
* Server operations
* ACL operations
* MAP operations
* stick-table operations
* Aggregation on various statistics
* Change global options for HAProxy

# Getting Started

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/jackpinetech/haproxy-api.git myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

# Docker

You will need docker and docker-compose installed to build the application.

- [Docker installation](https://docs.docker.com/engine/installation/)
- [Common problems setting up docker](https://docs.docker.com/toolbox/faqs/troubleshoot/)

After installing docker, start the application with the following commands :

```
# To build the project for the first time or when you add dependencies
docker-compose build web

# To start the application (or to restart after making changes to the source code)
docker-compose up web

```

To view the app, find your docker IP address + port 8080 (this will typically be http://localhost:8080/). To use a port other than 8080, you would need to modify the port in `.env`, `Dockerfile`, and `docker-compose.yml`.

# Licensing

The MIT License (MIT)

Copyright (c) 2019 Jackpine Technologies Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Changelog

You can find the changelog for the project in: [CHANGELOG.md](https://github.com/jackpinetech/haproxy-api/blob/master/CHANGELOG.md)
