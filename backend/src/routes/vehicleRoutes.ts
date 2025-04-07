import { Router } from 'express';
import { VehicleController } from '../controllers/vehicleController';

const router = Router();
const controller = new VehicleController();

router.get('/', controller.getAllVehicles);

router.get('/:id', controller.getVehicleById);

router.post('/', controller.createVehicle);

router.put('/:id', controller.updateVehicle);

router.delete('/:id', controller.deleteVehicle);

export const vehicleRoutes = router;
