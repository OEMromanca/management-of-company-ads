import { Router } from "express";
import {
  searchCompanies,
  addAdvertToCompany,
  getAllAds,
  deleteAdvertById,
  updateAdvertById,
  toggleTopAdvert,
} from "../controllers/companyModelController";
import { apiLimiter } from "../middlewares/rateLimiter";
import { uploadImage } from "../middlewares/uploadImage";

const companyRouter = Router();

companyRouter.get("/search", apiLimiter, searchCompanies);
companyRouter.get("/ads", apiLimiter, getAllAds);
companyRouter.delete("/ads/:advertId", apiLimiter, deleteAdvertById);
companyRouter.put(
  "/:ico/advert",
  apiLimiter,
  uploadImage.single("logo"),
  addAdvertToCompany
);
companyRouter.put("/ads/:advertId", apiLimiter, updateAdvertById);
companyRouter.patch("/ads/top/:advertId", apiLimiter, toggleTopAdvert);

export default companyRouter;
