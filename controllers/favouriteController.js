const Favourite = require("../models/Favourite");

// Add a project to favourites
exports.addFavourite = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    // Check if already added
    const exists = await Favourite.findOne({ userId, projectId });
    if (exists) {
      return res.status(400).json({ message: "Project already in favourites" });
    }

    const fav = new Favourite({ userId, projectId });
    await fav.save();

    res.status(200).json({ message: "Project added to favourites" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to favourites", error: err.message });
  }
};

// Get all favourite projects for a user
exports.getFavourites = async (req, res) => {
  try {
    const userId = req.headers.id;

    const favs = await Favourite.find({ userId }).populate("projectId");

    res.status(200).json({ data: favs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching favourites", error: err.message });
  }
};

// Remove a project from favourites
exports.removeFavourite = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers.id;

    const deleted = await Favourite.findOneAndDelete({ userId, projectId });

    if (!deleted) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from favourites", error: err.message });
  }
};
