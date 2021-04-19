const express = require("express");
const logfmt = require("logfmt");

const router = express.Router();

router.post("/", (req, res) => {
  //res.setHeader("Access-Control-Allow-Origin","https://mobsync.com.br");
  res.setHeader("Access-Control-Allow-Origin","*");
  if (!req.body.coordinates) {
    return res.status(422).json({ error: "Missing coordinates" });
  }

  const osrm = req.app.get("osrm");
  console.log(req.body.coordinates);
  const options = {
    coordinates: JSON.parse(req.body.coordinates),
    alternatives: req.body.alternatives || false,
    // Return route steps for each route leg
    steps: JSON.parse(req.body.steps) || false,
    // Return annotations for each route leg
    annotations: req.body.annotations || false,
    // Returned route geometry format. Can also be geojson
    geometries: req.body.geometries || "polyline",
    // Add overview geometry either full, simplified according to
    // highest zoom level it could be display on, or not at all
    overview: req.body.overview || "false",
    // Forces the route to keep going straight at waypoints and don't do
    // a uturn even if it would be faster. Default value depends on the profile
    continue_straight: req.body.continue_straight || false
  };

  try {
    osrm.route(options, (err, result) => {
      if (err) {
        return res.status(422).json({ error: err.message });
      }
      return res.json(result);
    });
  } catch (err) {
    logfmt.error(new Error(err.message));
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

