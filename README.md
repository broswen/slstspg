# Example Serverless project with Typescript and Sequelize (Postgres)

- serverless with Typescript and linting 
- serverless-offline for local testing with postres in Docker 

### TODO
- [x] setup winston logging
- [x] setup sequelize and postgres connection
- [x] setup docker postgres for testing
- [x] setup stage variable files
- [ ] cache Sequelize connection
- [ ] cache secretsmanager

### Testing

Run a local postgres database using Docker with the following command.

```docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres```

Run the script `create-database.sql` and then `create-table.sql` found in the `src/sql` directory to create the database and table.

Run the command `npm run offline` to start the project with serverless-offline. This starts serverless-offline with the stage set to `local`. 

### Code Style

Typescript style is enforced using ESLint. Run `npm run lint` to run the linter.