import { AppDataSource } from './config/database';
import { seedVehicles } from './services/seedService';

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection established.");
    await seedVehicles();
    console.log("Seed process complete.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
