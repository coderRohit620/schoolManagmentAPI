import express from "express";

import {
    addSchool,
    listSchools
} from "../controllers/school.controller.js";

const router = express.Router();



// ADD SCHOOL
router.post("/addSchool", addSchool);



// LIST SCHOOLS
router.get("/listSchools", listSchools);

export default router;