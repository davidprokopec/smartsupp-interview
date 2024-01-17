# Smartsupp interview project

## Thoughts

Never worked with Nest.js before. Structure looks very weird to me, moved modules from src/ to src/modules because im used to util folders in src/, i dont
want that in the root
Using environment variables for database url, seen that i should probably use Nest Config module. 
Im parsing the variables using zod, which is  standard to me and I dont know if Nest does some parsing like this as well. Probably could be implemented
using the Config module, but dont want to waste time doing that




## Requirements

* Prepare a simple http server for handling task assignement.
* Main used entities:
* 1. agent - name, email
* 2. task - name, description, expected duration
* API to implement:
* 1. endpoint to add agent - agent is unique by email
* 2. endpoint to assign task to agent - request body contains task name, description, duration, agent id
* 3. endpoint to mark task as done
* Features needed:
* - if task is not finished by expected duration(time created + duration), push to queue
* - (assume this is another instance) consume from queue and log that the task was not finished
* Technical specification:
* - Koa.js or NestJS framework
* - data should be stored in some SQL DB
* - any queue system that you choose
* - you can use other DB entities and properties as you see fit
* - tests
* - documentation on how to start the project(so we can try it locally)
