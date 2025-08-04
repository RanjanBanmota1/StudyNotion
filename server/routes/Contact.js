const express= require("express")
const router = express.Router()

const{
    contactUsController
} = require("../controllers/ContactUs")

router.post("/contacUs", contactUsController)

module.exports = router