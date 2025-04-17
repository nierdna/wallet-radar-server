// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';
// import { join } from 'path';

// // Load environment variables
// dotenv.config();

// // Create a new data source for migrations
// const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
//   migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
//   synchronize: false,
//   logging: true,
// });

// // Initialize and run migrations
// AppDataSource.initialize()
//   .then(async () => {
//     console.log('Data Source has been initialized!');

//     // Run migrations
//     await AppDataSource.runMigrations();
//     console.log('Migrations have been run successfully');

//     // Close the connection
//     await AppDataSource.destroy();
//     console.log('Data Source has been closed');
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error('Error during Data Source initialization:', err);
//     process.exit(1);
//   });
