/// All const required -----
const Sauce = require('../models/Sauce');
// filesystem to modify files
const fs = require('fs');

// Display ALL SAUCES -----
exports.allSauces = (req, res, next) => {
    Sauce.find()
        .then((aSauces) => {
            res.status(200).json(aSauces);
        })
        .catch((error) => res.status(400).json({error}));
};

// Display SELECTED SAUCE ----
exports.selectedSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sltdSauce) => res.status(200).json(sltdSauce))
        .catch((error) => res.status(400).json({error}));
};

// Create SAUCE ----
exports.createSauce = (req, res, next) => {
    //extraction of the sauce via parse
    const extractSauce = JSON.parse(req.body.sauce);
    delete extractSauce._id;
    delete extractSauce.userId;

    const sauceCreated = new Sauce({
        //destructuring ES6 : https://www.youtube.com/watch?v=NIq3qLaHCIs
        ...extractSauce,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    if (sauceCreated.heat < 0 || sauceCreated.heat > 10) {
        sauceCreated.heat = 0;
    }
    sauceCreated
    .save()
    .then(() => res.status(201).json({message: 'Sauce saved'}))
    .catch((error) => res.status(400).json({error}));
};

// Modify SAUCE ----
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message : 'Access Denied'})
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modified'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => res.status(400).json({error}));
};

// Delete SAUCE ----
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce erased !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.likeSauce = (req, res, next) => {
    const voters = req.body.userId;
    const likeValue = req.body.like;
    const sauceId = req.params.id;

    Sauce.findOne({_id: sauceId})
    .then((sauce) => {
        if(!sauce.usersLiked.includes(voters) && likeValue === 1) {
            Sauce.updateOne({_id: sauceId}, {$inc:{likes: 1}, $push: {usersLiked: voters}})
            .then(() => res.status(200).json({ message: "Sauce Liked" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersLiked.includes(voters) && likeValue === 0) {
            Sauce.updateOne({_id: sauceId}, {$inc:{likes: -1}, $pull: {usersLiked: voters}})
            .then(() => res.status(200).json({ message: "Sauce Unliked" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (!sauce.usersDisliked.includes(voters) && likeValue === -1) {
            Sauce.updateOne({_id: sauceId}, {$inc:{dislikes: 1}, $push: {usersDisliked: voters}})
            .then(() => res.status(200).json({ message: "Sauce Disliked" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(voters) && likeValue === 0) {
            Sauce.updateOne({_id: sauceId}, {$inc:{dislikes: -1}, $pull: {usersDisliked: voters}})
            .then(() => res.status(200).json({ message: "Sauce Undisliked" }))
            .catch((error) => res.status(400).json({ error }));
        }

    })
    .catch((error) => res.status(400).json({ error }));
};
