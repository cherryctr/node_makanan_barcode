import express from "express";
import { generateBarcodeForMakanans } from "../controller/MakananController.js";

const apiRouter = express.Router();

// API route to get all makanans with dynamically generated barcodes
apiRouter.get("/makanans", generateBarcodeForMakanans);

export default apiRouter;
