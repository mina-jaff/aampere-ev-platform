import request from 'supertest';
import { DataSource } from 'typeorm';
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import app from '../src/app';
import { Vehicle } from '../src/models/Vehicle';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test_user',
    password: 'test_password',
    database: 'test_db',
    entities: [Vehicle],
    synchronize: true,
    dropSchema: true
  });

  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('Vehicle API', () => {
  const testVehicle = {
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 89990,
    range_km: 405,
    color: 'Red',
    condition: 'New',
    battery_capacity_kWh: 100,
    charging_speed_kW: 250,
    seats: 5,
    drivetrain: 'AWD',
    location: 'Berlin',
    autopilot: true,
    kilometer_count: 0,
    accidents: false,
    images: []
  };

  let vehicleId: string;

  test('POST /api/vehicles - Create a new vehicle', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send(testVehicle);
    
    expect(response.status).toBe(201);
    expect(response.body.brand).toBe(testVehicle.brand);
    expect(response.body.model).toBe(testVehicle.model);
    
    vehicleId = response.body.id;
  });

  test('GET /api/vehicles - Get all vehicles', async () => {
    const response = await request(app).get('/api/vehicles');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/vehicles/:id - Get vehicle by ID', async () => {
    const response = await request(app).get(`/api/vehicles/${vehicleId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(vehicleId);
    expect(response.body.brand).toBe(testVehicle.brand);
  });

  test('PUT /api/vehicles/:id - Update vehicle', async () => {
    const updatedData = {
      price: 79990,
      range_km: 410
    };
    
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .send(updatedData);
    
    expect(response.status).toBe(200);
    expect(response.body.price).toBe(updatedData.price);
    expect(response.body.range_km).toBe(updatedData.range_km);
  });

  test('GET /api/vehicles?brand=Tesla - Filter vehicles by brand', async () => {
    const response = await request(app).get('/api/vehicles?brand=Tesla');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].brand).toBe('Tesla');
  });

  test('DELETE /api/vehicles/:id - Delete vehicle', async () => {
    const response = await request(app).delete(`/api/vehicles/${vehicleId}`);
    
    expect(response.status).toBe(204);
    
    const getResponse = await request(app).get(`/api/vehicles/${vehicleId}`);
    expect(getResponse.status).toBe(404);
  });
});
