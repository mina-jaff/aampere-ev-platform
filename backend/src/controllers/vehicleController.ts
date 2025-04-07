import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Vehicle } from '../models/Vehicle';

export class VehicleController {
  async getAllVehicles(req: Request, res: Response): Promise<void> {
    try {
      const vehicleRepository = AppDataSource.getRepository(Vehicle);
      const query = req.query;
      
      const queryBuilder = vehicleRepository.createQueryBuilder('vehicle');
      
      if (query.brand) {
        queryBuilder.andWhere('vehicle.brand ILIKE :brand', { brand: `%${query.brand}%` });
      }
      
      if (query.model) {
        queryBuilder.andWhere('vehicle.model ILIKE :model', { model: `%${query.model}%` });
      }
      
      if (query.year) {
        queryBuilder.andWhere('vehicle.year = :year', { year: query.year });
      }
      
      if (query.minPrice && query.maxPrice) {
        queryBuilder.andWhere('vehicle.price BETWEEN :minPrice AND :maxPrice', { 
          minPrice: query.minPrice, 
          maxPrice: query.maxPrice 
        });
      } else if (query.minPrice) {
        queryBuilder.andWhere('vehicle.price >= :minPrice', { minPrice: query.minPrice });
      } else if (query.maxPrice) {
        queryBuilder.andWhere('vehicle.price <= :maxPrice', { maxPrice: query.maxPrice });
      }
      
      if (query.minRange) {
        queryBuilder.andWhere('vehicle.range_km >= :minRange', { minRange: query.minRange });
      }
      
      if (query.maxRange) {
        queryBuilder.andWhere('vehicle.range_km <= :maxRange', { maxRange: query.maxRange });
      }
      
      if (query.condition) {
        queryBuilder.andWhere('vehicle.condition = :condition', { condition: query.condition });
      }
      
      if (query.location) {
        queryBuilder.andWhere('vehicle.location ILIKE :location', { location: `%${query.location}%` });
      }
      
      const vehicles = await queryBuilder.getMany();
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
  }

  async getVehicleById(req: Request, res: Response): Promise<void> {
    try {
      const vehicleRepository = AppDataSource.getRepository(Vehicle);
      const id = req.params.id;
      
      const vehicle = await vehicleRepository.findOne({
        where: { id }
      });
      
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }
      
      res.status(200).json(vehicle);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      res.status(500).json({ message: 'Failed to fetch vehicle' });
    }
  }

  async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleRepository = AppDataSource.getRepository(Vehicle);
      const newVehicle = vehicleRepository.create(req.body);
      
      const result = await vehicleRepository.save(newVehicle);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ message: 'Failed to create vehicle' });
    }
  }

  async updateVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleRepository = AppDataSource.getRepository(Vehicle);
      const id = req.params.id;
      
      const vehicle = await vehicleRepository.findOne({
        where: { id }
      });
      
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }
      
      vehicleRepository.merge(vehicle, req.body);
      const result = await vehicleRepository.save(vehicle);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ message: 'Failed to update vehicle' });
    }
  }

  async deleteVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleRepository = AppDataSource.getRepository(Vehicle);
      const id = req.params.id;
      
      const vehicle = await vehicleRepository.findOne({
        where: { id }
      });
      
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }
      
      await vehicleRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ message: 'Failed to delete vehicle' });
    }
  }
}
