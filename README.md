# mean-boilerplate

## Warning

This is a VERY rough work in progress. The project structure, code, and
documentation are not complete or optimized.
I am making this repo public in hopes that even in its rough state it
may help someone get started with this flavor of tech stack.

Once I am comfortable with the state of this project I will release a
version 1.0 and write a blog post tour of what the boilerplate provides.
Until then, no judgement is allowed. :-)

## Overview

This project uses the MEAN (MongoDB, Express, Angular, Node) stack to create a basic web page to
demonstrate the tech stack.

There are a couple other goodies hiding within. A simple RBAC implementation is also shown as well
as JWT (JSON Web Token) based authentication.

## Installation

## Startup

### Database

Install mongodb http://www.mongodb.org/

To start the mongo data base open a terminal, navigate to the root of the project and enter:

    mongod —dbpath <path to config file>


Once the database is running, the admin console can be reached by entering the following:

    mongo

### Dependencies

Make sure that you have installed npm and bower.

    http://nodejs.org/
    sudo npm install -g bower

Download and install dependencies by running the following commands.

    npm install && bower install

### Node Server

The server is started and built with a single command

To build the project, navigate to the root of the project and enter:

    gulp notest


## TODO

* User profile - Update user profiles.

* RBAC - Users will have access to different tabs. All sensitive server side APIs will be protected through Roles so
even if an astute user opens the developer console and gets access to the protected client code, the server data will
remain safe.


