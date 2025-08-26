const express = require("express");
const { addFavourite, getFavourites, removeFavourite } = require("../controllers/favouriteController");

const router = express.Router();

// Add project to favourites
router.post("/add-favourite", addFavourite);

// Get all favourite projects
router.get("/get-favourite-project", getFavourites);

// Remove project from favourites
router.delete("/remove-favourite/:projectId", removeFavourite);

module.exports = router;

