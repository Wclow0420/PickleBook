import express from 'express';
import { loginLocation, appointmentsLocation, appointmentCancel, locationList, changeAvailablity, appointmentComplete, locationDashboard, locationProfile, updateLocationProfile} from '../controllers/locationController.js';
import authLocation from '../middleware/authLocation.js';
const locationRouter = express.Router();

locationRouter.post("/login", loginLocation)
locationRouter.post("/cancel-appointment", authLocation, appointmentCancel)
locationRouter.get("/appointments", authLocation, appointmentsLocation)
locationRouter.get("/list", locationList)
locationRouter.post("/change-availability", authLocation, changeAvailablity)
locationRouter.post("/complete-appointment", authLocation, appointmentComplete)
locationRouter.get("/dashboard", authLocation, locationDashboard)
locationRouter.get("/profile", authLocation, locationProfile)
locationRouter.post("/update-profile", authLocation, updateLocationProfile)

export default locationRouter;