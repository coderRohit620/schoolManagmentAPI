import db from "../config/db.js";

// ADD SCHOOL
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // VALIDATION
    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // INSERT SCHOOL
    const query = `
            INSERT INTO schools
            (name, address, latitude, longitude)
            VALUES (?, ?, ?, ?)
        `;

    await db.execute(query, [name, address, latitude, longitude]);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIST SCHOOLS
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // FETCH ALL SCHOOLS
    const [schools] = await db.execute("SELECT * FROM schools");

    // DISTANCE FUNCTION
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;

      const dLat = ((lat2 - lat1) * Math.PI) / 180;

      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    };

    // SORT SCHOOLS
    const sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          school.latitude,
          school.longitude,
        );

        return {
          ...school,
          distance: distance.toFixed(2),
        };
      })

      .sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      data: sortedSchools,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export { addSchool , listSchools }