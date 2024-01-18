# Smartsupp interview project

## How to run

Go into root directory of this project and run `docker compose up -d`, wait for the image to build and then test the API on localhost:3000.

You can use the included Postman collection from `postman-collection.json`.

Check the logs with `docker logs smartsupp-interview-app-1`.

### Timestamp problem

`expectedTimeDone: timestamp('expected_time_done').notNull(),` - this one column wasted me a whole day

#### The problem

Saving, comparing and logging the dates all worked as it should, but for some reason when returning this one specific column to a json response,
the hour would be -1 than it was in database, in logs, everywhere. If this was a real app, I wouldn't want my frontend to receive a date with wrong
hour, so I somehow fixed, but its really messy and the `expectedTimeDone` is returned as ISO string, all the other timestamps are as Dates.

##### Solution

I changed the column type to `string` which saves the date as ISO string. Then I had to use luxon for
adding the duration minutes to current time and saving it in db. However when importing the ISO date to luxon, it doesn't work, so I had to use JS `new Date()` for comparing the two dates.

I hope this is not some obvious issue, but I really don't think so because if I change the TZ env variable both in bun and postgres to Europe/London,
the issue goes away and all times are the same. I have tested node instead of bun, but issue is the same, so I think its an issue with the drizzle-orm
and have already been communicating with the contributors of Drizzle to figure out the issue.

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
