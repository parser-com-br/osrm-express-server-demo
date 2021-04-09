const express = require("express");
const logfmt = require("logfmt");

const router = express.Router();

router.post("/", (req, res) => {
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

  console.log(options);
/*
  var options = {
    coordinates: [
      [13.36761474609375, 52.51663871100423],
      [13.374481201171875, 52.506191342034576]
    ],
    source: "first",
    destination: "last",
    roundtrip: false
  }
*/
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
