const express = require('express');
const fetchuser = require('../middleware/getuser');
const router = express.Router();
const Notes = require('../models/Notes');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// router.get('/', (req, res) => {
//     res.json([])
// });


//  Route 1: Fetching all notes
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.userId.id })
    res.json(notes);
})

// Route 2: Add notes
router.post('/addnote', fetchuser, [
    body('title', "Enter title").isLength({ min: 3 }),
    body('description', 'Enter description').isLength({ min: 5 })
], async (req, res) => {
    const userId = await User.findById(req.userId.id);
    if (!userId) {
        res.send('User does not exist')
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let note = await Notes.create({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.userId.id
        });
        res.json(note);
    } catch (err) {
        res.json(err);
        console.log(err);
    }
})

// Route 3: Update a note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const userId = await User.findById(req.userId.id);
        if (!userId) {
            return res.send('User does not exist')
        }
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.send('Note does not exist');
        }
        if (userId.id !== note.user.toString()) {
            console.log(userId.id.toString());
            console.log(note.user.toString());
            return res.status(401).send("unauthorised access");
        }


        // create new  note
        let newNote = {};
        if (req.body.title) { newNote.title = req.body.title }
        if (req.body.description) { newNote.description = req.body.description }
        if (req.body.tag) { newNote.tag = req.body.tag }

        // find the new note to be updated and update it
        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true})
        res.json(newNote);
        
    } catch (err) {
        res.json(err);
        console.log(err);
    }
})

// Route 4: Delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const userId = await User.findById(req.userId.id);
        if (!userId) {
            return res.send('User does not exist')
        }
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.send('Note does not exist');
        }
        if (userId.id !== note.user.toString()) {
            return res.status(401).send("unauthorised access");
        }

        // create new  note
        // let newNote = {};
        // if (req.body.title) { newNote.title = req.body.title }
        // if (req.body.description) { newNote.description = req.body.description }
        // if (req.body.tag) { newNote.tag = req.body.tag }

        // find the new note to be updated and delete it
        note = await Notes.findByIdAndDelete(req.params.id)
        res.send('Note deleted successfully');
        
    } catch (err) {
        res.json(err);
        console.log(err);
    }
})



module.exports = router;
