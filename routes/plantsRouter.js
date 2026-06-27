const express= require('express');
const router= express.Router();

const Plant= require('../Models/Plants');
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});
const plantValidation= require('../PlantValidation.js');

router.get("/", async(req, res)=>{
    let Plants= await Plant.find();
    res.render("pages/plantation.ejs", {Plants, success: req.flash('success'), error: req.flash('error') });
});
router.get("/:id", async(req, res)=>{
    let {id}= req.params;
    let plant=await Plant.findById(id);
    res.render("pages/plantDetail.ejs",{plant})
});
router.get('/:id/edit', async (req, res)=>{
    let {id}= req.params;
    let plant=await Plant.findById(id);
    res.render('pages/editPlant.ejs', {plant});
});
router.patch('/:id/edit', upload.single(`Plant[image]`), async (req, res)=>{
    let {id}= req.params;
    let result= plantValidation.validate(req.body);
    let plant= await Plant.findById(id);
    let {image:previous_image}= plant.image;
    let{name}= plant.name;
    if(result.error){
    throw new expressError(400, result.error)
  }else{
  if(req.file){
  let {path, filename}= req.file;
  req.body.Plant.image={url:path, filename:filename}
  } else{
    req.body.Plant.image= previous_image;
  }
  await Plant.findByIdAndUpdate(id, req.body.Plant);
  req.flash('success', `${name} edited`);
  res.redirect('/plant');
}
});
router.delete('/:id/delete', async(req, res)=>{
    let {id}= req.params;
    let plantToBeDeleted= await Plant .findById(id);
    let name= plantToBeDeleted.name;
    req.flash('success', `${name} deleted`);
    await Plant.findByIdAndDelete(id);
    res.redirect('/plant');
});
router.post('/', upload.single('Plant[image]'), async(req, res)=>{
   
  let result= plantValidation.validate(req.body);
  if(result.error){
    throw new expressError(400, result.error)
  }else{
  let {path, filename}= req.file;
  const new_plant= new Plant(req.body.Plant);
  new_plant.image= {url:path, filename:filename};
  await new_plant.save();
  req.flash('success', `${req.body.Plant.name} Plant added`);
  res.redirect('/plant');}
});
router.get('/new', (req, res)=>{
    
        res.render('pages/newPlant.ejs');
    
});

module.exports= router;