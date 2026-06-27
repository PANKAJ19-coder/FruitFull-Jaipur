const express= require('express');
const router= express.Router();

const Event= require('../Models/Event.js');
const eventValidation =require('../EventValidation.js');


router.get("/", async(req, res)=>{
    let events= await Event.find()
    res.render("pages/events.ejs", {events, success: req.flash('success'), error: req.flash('error')});
});
router.get('/new', (req, res)=>{
    res.render('pages/newEvent.ejs');
});
router.post('/new',async (req, res)=>{
    let result= eventValidation.validate(req.body);
  if(result.error){
    throw new expressError(400, result.error)
  }else{
    let {event}= req.body;
    let new_event= new Event(event);
    await new_event.save();
    req.flash('success', "New event added successfully");
    res.redirect('/events');
  }
});
router.delete('/:id/delete', async(req, res)=>{
    let {id}= req.params;
    let event= await Event.findById(id);
    let title= event.title;
    await Event.findByIdAndDelete(id);
    req.flash('success', `Event ${title} Deleted `);
    res.redirect('/events');
});

module.exports= router;