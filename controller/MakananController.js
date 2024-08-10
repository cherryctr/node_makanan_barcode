import Makanans from "../models/MakananModels.js";
import bwipjs from "bwip-js";
import path from "path";
import fs from "fs";

// Get all makanans
export const getMakanans = async (req, res) => {
	try {
		const makanans = await Makanans.findAll();
		res.status(200).json(makanans);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get makanans by ID
export const getMakanansById = async (req, res) => {
	try {
		const makanans = await Makanans.findOne({
			where: { id: req.params.id },
		});
		if (makanans) {
			res.status(200).json(makanans);
		} else {
			res.status(404).json({ message: "Makanan not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Save a new makanans
export const saveMakanans = async (req, res) => {
	try {
		const newMakanan = await Makanans.create(req.body);
		res.status(201).json(newMakanan);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Update makanans by ID
export const updateMakanans = async (req, res) => {
	try {
		const makanans = await Makanans.findOne({
			where: { id: req.params.id },
		});

		if (makanans) {
			await makanans.update(req.body);
			res.status(200).json({ message: "Makanan updated successfully" });
		} else {
			res.status(404).json({ message: "Makanan not found" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete makanans by ID
export const deleteMakanans = async (req, res) => {
	try {
		const makanans = await Makanans.findOne({
			where: { id: req.params.id },
		});

		if (makanans) {
			await makanans.destroy();
			res.status(200).json({ message: "Makanan deleted successfully" });
		} else {
			res.status(404).json({ message: "Makanan not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Function to display all makanans with barcodes
// Function to display all makanans with barcodes as base64 images
export const showMakanansWithBarcodes = async (req, res) => {
	try {
		const makanans = await Makanans.findAll();
		console.log(res);
		// Generate barcodes as base64 strings and attach to the makanan objects
		for (const makanan of makanans) {
			const barcodeText = makanan.kode_makanan || makanan.nama_makanan;

			// Generate barcode using bwip-js
			const png = await new Promise((resolve, reject) => {
				bwipjs.toBuffer(
					{
						bcid: "code128", // Barcode type
						text: barcodeText, // Text to encode
						scale: 3, // 3x scaling factor
						height: 10, // Bar height, in millimeters
						includetext: true, // Show human-readable text
						textxalign: "center", // Align text to the center
					},
					(err, png) => {
						if (err) {
							reject(err);
						} else {
							resolve(png);
						}
					}
				);
			});

			// Convert PNG buffer to base64
			makanan.barcodeBase64 = `data:image/png;base64,${png.toString("base64")}`;
		}

		// Render the view with the makanans data
		res.render("makanans/index", { makanans });
	} catch (error) {
		console.error("Error in showMakanansWithBarcodes:", error);
		res
			.status(500)
			.json({ message: "Error generating barcodes", error: error.message });
	}
};

// Function to generate barcodes for makanans and return them in JSON format
export const generateBarcodeForMakanans = async (req, res) => {
	try {
		const makanans = await Makanans.findAll();

		// Generate barcodes as base64 strings and attach to the makanan objects
		for (const makanan of makanans) {
			const barcodeText = makanan.kode_makanan || makanan.nama_makanan;

			// Generate barcode using bwip-js
			const png = await new Promise((resolve, reject) => {
				bwipjs.toBuffer(
					{
						bcid: "code128", // Barcode type
						text: barcodeText, // Text to encode
						scale: 3, // 3x scaling factor
						height: 10, // Bar height, in millimeters
						includetext: true, // Show human-readable text
						textxalign: "center", // Align text to the center
					},
					(err, png) => {
						if (err) {
							reject(err);
						} else {
							resolve(png);
						}
					}
				);
			});

			// Convert PNG buffer to base64
			makanan.dataValues.barcodeImage = `data:image/png;base64,${png.toString(
				"base64"
			)}`;
		}

		// Return the makanans with generated barcodes in JSON format
		res.status(200).json(makanans);
	} catch (error) {
		console.error("Error generating barcodes:", error);
		res
			.status(500)
			.json({ message: "Error generating barcodes", error: error.message });
	}
};
