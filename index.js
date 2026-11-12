const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

let houses = [
    {
        "_id":1,
        "name": "Farmhouse",
        "size": 2000,
        "bedrooms": 3,
        "bathrooms": 2.5,
        "features": [
            "wrap around porch",
            "attached garage"
        ],
        "main_image": "farm.webp"
    },
    {
        "_id":2,
        "name": "Mountain House",
        "size": 1700,
        "bedrooms": 3,
        "bathrooms": 2,
        "features": [
            "grand porch",
            "covered deck"
        ],
        "main_image": "mountain-house.webp"
    },
    {
        "_id":3,
        "name": "Lake House",
        "size": 3000,
        "bedrooms": 4,
        "bathrooms": 3,
        "features": [
            "covered deck",
            "outdoor kitchen",
            "pool house"
        ],
        "main_image": "farm.webp"
    }
]

app.get("/api/houses", (req,res)=>{
    res.send(houses);
});

app.post("/api/houses", upload.single("img"), (req,res)=>{
    const result = validateHouse(req.body);

    if(result.error){
        console.log("Error in validation");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const house = {
        _id:houses.length+1,
        name:req.body.name,
        size:req.body.size,
        bedrooms:req.body.bedrooms,
        bathrooms:req.body.bathrooms
    };

    if(req.file){
        house.main_image = req.file.filename;
    }

    houses.push(house);

    res.status(200).send(house);
});

const validateHouse = (house) => {
    const schema = Joi.object({
        _id:Joi.allow(""),
       name:Joi.string().min(3).required(),
       size:Joi.number().min(0),
       bedrooms:Joi.number().min(0),
       bathrooms:Joi.number().min(0),
       features:Joi.allow("")
    });

    return schema.validate(house);
};

//listen for incoming requests
app.listen(3001, ()=>{
  console.log("Server is up and running");
});