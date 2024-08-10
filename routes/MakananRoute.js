import express from "express";

import {
	getMakanans,
	updateMakanans,
	getMakanansById,
	deleteMakanans,
	saveMakanans,
	showMakanansWithBarcodes,
	generateBarcodeForMakanans,
} from "../controller/MakananController.js";

const router = express.Router();

const apiRouter = express.Router();

// API route to get all makanans with dynamically generated barcodes
apiRouter.get("/api-makanans", generateBarcodeForMakanans);

router.post("/makanan/save", saveMakanans);
router.get("/makanan", getMakanans);
router.get("/makanan/:id", getMakanansById);
router.get("/makanan/delete/:id", deleteMakanans);
router.get("/makanan/update/:id ", updateMakanans);

router.get("/view-makanans", showMakanansWithBarcodes);
router.get("/generate-barcodes", generateBarcodeForMakanans);

export default router;
