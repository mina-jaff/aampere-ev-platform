import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/database';
import { Vehicle } from '../models/Vehicle';

export async function seedVehicles(): Promise<void> {
  try {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    
    const existingCount = await vehicleRepository.count();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} vehicles. Skipping seed.`);
      return;
    }
    
    const dataFilePath = path.join(__dirname, '../../../data/vehicle_data.json');
    let rawData;
    
    try {
      rawData = fs.readFileSync(dataFilePath, 'utf8');
    } catch (err) {
      console.log('Could not find data file at expected location, creating sample data...');
      rawData = JSON.stringify({
        count: 2,
        data: [
          {
            "id": "b0f00de2-0a81-4d2c-9717-712e6d39710e",
            "brand": "Tesla",
            "model": "Model S",
            "year": 2020,
            "price": 79999,
            "range_km": 610,
            "color": "Red",
            "condition": "Used",
            "battery_capacity_kWh": 100,
            "charging_speed_kW": 250,
            "seats": 5,
            "drivetrain": "AWD",
            "location": "Berlin",
            "autopilot": true,
            "kilometer_count": 25000,
            "accidents": true,
            "accident_description": "Rear bumper scratch repaired",
            "images": [
              "https://example.com/tesla1.jpg",
              "https://example.com/tesla2.jpg"
            ]
          },
          {
            "id": "44360131-c4bb-4323-8780-786c779037a7",
            "brand": "Nissan",
            "model": "Leaf",
            "year": 2019,
            "price": 29999,
            "range_km": 270,
            "color": "White",
            "condition": "New",
            "battery_capacity_kWh": 40,
            "charging_speed_kW": 50,
            "seats": 5,
            "drivetrain": "FWD",
            "location": "München",
            "autopilot": false,
            "kilometer_count": 0,
            "accidents": false,
            "images": [
              "https://example.com/nissan1.jpg",
              "https://example.com/nissan2.jpg"
            ]
          }
        ]
      });
    }
    
    const parsedData = JSON.parse(rawData);
    const vehicleData = parsedData.data || parsedData;
    
    // Transform the data to match the Vehicle model
    const vehicles = vehicleData.map((data: any) => {
      return vehicleRepository.create({
        id: data.id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        range_km: data.range_km,
        color: data.color,
        condition: data.condition,
        battery_capacity_kWh: data.battery_capacity_kWh,
        charging_speed_kW: data.charging_speed_kW,
        seats: data.seats,
        drivetrain: data.drivetrain,
        location: data.location,
        autopilot: data.autopilot,
        kilometer_count: data.kilometer_count,
        accidents: data.accidents,
        accident_description: data.accident_description || null,
        images: data.images || []
      });
    });
    
    await vehicleRepository.save(vehicles);
    console.log(`Successfully seeded ${vehicles.length} vehicles to the database.`);
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    throw error;
  }
}
