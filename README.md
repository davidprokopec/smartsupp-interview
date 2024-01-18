# Smartsupp interview project

## How to run

Go into root directory of this project and run `docker compose up -d`, wait for the image to build and then test the API on localhost:3000.

You can use the included Postman collection from `postman-collection.json`.

Check the logs with `docker logs smartsupp-interview-app-1`.

### Timestamp problem
This wasted me a whole day.

I'm using the Drizzle ORM with node-postgres driver and postgres as my database. When storing a timestamp to db from javascript `new Date()`,
the timestamp stored in DB would be -1 hour from the real time. This is probably caused because of some bug in Drizzle or the postgres driver,
I've been communicating with the Drizzle team about this and they helped me find a temporary fix.

#### The solution

The solution is to change the timestamp columns which are set from JS. 

I added these options:
* `mode: 'string'` - this changes the typescript type of the column to 'string' and the date is set using `new Date().toISOString()` 
* `withTimezone: true` - this adds the timezone info to the timestamp


I also changed all the `createdAt` and `updatedAt` to same settings so the format when receiving JSON response is the same.




## Requirements

- Prepare a simple http server for handling task assignement.
- Main used entities:
  1.  agent - name, email
  2.  task - name, description, expected duration
- API to implement:
  1.  endpoint to add agent - agent is unique by email
  2.  endpoint to assign task to agent - request body contains task name, description, duration, agent id
  3.  endpoint to mark task as done
- Features needed:
  - if task is not finished by expected duration(time created + duration), push to queue
  - (assume this is another instance) consume from queue and log that the task was not finished
- Technical specification:
  - Koa.js or NestJS framework
  - data should be stored in some SQL DB
  - any queue system that you choose
  - you can use other DB entities and properties as you see fit
  - tests
  - documentation on how to start the project (so we can try it locally)
