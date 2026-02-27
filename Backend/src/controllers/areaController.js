const Area = require("../models/Area");

//  CREATE NEW AREA (with optional subareas)

exports.createArea = async (req, res) => {
  try {
    const { name, subareas } = req.body;

    if (!name)
      return res.status(400).json({ msg: "Area name is required" });

    const exists = await Area.findOne({ name: name.trim() });
    if (exists)
      return res.status(400).json({ msg: "Area already exists" });

    const area = await Area.create({
      name: name.trim(),
      subareas: Array.isArray(subareas) ? subareas : [],
    });

    return res.status(201).json({
      msg: "Area created successfully",
      area,
    });

  } catch (err) {
    console.error("Create area error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



//  ADD SUBAREAS TO EXISTING AREA

exports.addSubareasToArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const { subareas } = req.body;

    if (!Array.isArray(subareas) || subareas.length === 0) {
      return res.status(400).json({
        msg: "subareas must be a non-empty array",
      });
    }

    const area = await Area.findByIdAndUpdate(
      areaId,
      {
        $addToSet: {
          subareas: { $each: subareas },
        },
      },
      { new: true }
    );

    if (!area)
      return res.status(404).json({ msg: "Area not found" });

    return res.json({
      msg: "Subareas added successfully",
      area,
    });

  } catch (err) {
    console.error("Add subareas error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



//  GET ALL AREAS (shopkeeper & vendor)

exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 }).lean();
    console.log("entered to getarea!!!!");
    console.log(areas);


    res.json({
      msg: "Areas fetched successfully",
      areas,
    });

  } catch (err) {
    console.error("Get areas error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



//  GET SUBAREAS FOR SPECIFIC AREA (shopkeeper & vendor)

exports.getSubareas = async (req, res) => {
  try {
    const { areaId } = req.params;

    const area = await Area.findById(areaId).lean();

    if (!area) {
      return res.status(404).json({ msg: "Area not found" });
    }

    return res.json({
      msg: "Subareas fetched successfully",
      area: area.name,
      subareas: area.subareas || [],
    });

  } catch (err) {
    console.error("Get subareas error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

