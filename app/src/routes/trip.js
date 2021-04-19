const express = require("express");
const logfmt = require("logfmt");

const router = express.Router();

router.post("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin","https://mobsync.com.br");
  if (!req.body.coordinates) {
    return res.status(422).json({ error: "Missing coordinates" });
  }

  const osrm = req.app.get("osrm");
  
  const options = {
    coordinates: JSON.parse(req.body.coordinates),
    source: req.body.source,
    destination: req.body.destination,
    roundtrip: JSON.parse(req.body.roundtrip)
  };

  if (!req.body.sources || !req.body.destinations) {
    delete options.sources;
    delete options.destinations;
  }



  try {

    osrm.trip(options, function(err, response) {

      if (err) {
        return res.status(422).json({ error: err.message });
      }
      return res.json(response);


    });
  } catch (err) {
    logfmt.error(new Error(err.message));
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
