import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addLocation, allLocations, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/locationController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-location", authAdmin, upload.single('image'), addLocation)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-locations", authAdmin, allLocations)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;