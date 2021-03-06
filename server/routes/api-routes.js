const express = require('express');
const router = new express.Router();
const validator = require('validator');
const passport = require('passport');
const db = require('../models');
const path = require('path');
let items={posts: [], members: [], act:[]};


/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 * @description errors tips, and a global message for the whole form.
 */
.3
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';
  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}


/**
 * @description user values passed through from auth middleware
 */
router.get('/dashboard', (req, res) => {
  db.Post.find({}).then((data) => {
     items.posts = data.reverse();
     db.Activity.find({}).then((acts) => {
      items.act = acts.reverse();
      if(req.user.access === 2){
        res.status(200).json({
         message: "You're authorized to see this secret message.",
         user: req.user,
         items: items
       });
    }
    else
     if(req.user.access === 1){
     db.User.find({}).then((members) => {
       items.members = members.reverse(); 
       res.status(200).json({
         message: "You're authorized to see this secret message.",
         user: req.user,
         items: items
       });

     }).catch(function(err) {
       res.json(items);
     });
    }
   }).catch(function(err) {
    res.json(items);
  });
}).catch(function(err) {
      res.json(err);
  });
     
});

/**
 * @description user signup
 */
router.post('/signup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-signup', (err,...b) => {
    if (err) {
      
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    });
  })(req, res, next);
});

/**
 * @description add new post 
 */
router.post("/addPost", (req, res) => {
  const userId = req.body.userId;
  if(!((req.body.title)&&(req.body.subtitle)&&(req.body.context)))
  return res.status(400).json({
    success: false,
    message: 'fill title and subtitle and cotext',
    errors: {title1: 'Please provide a correct email address.'}
  });
   
  const post = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    imageAddress: req.body.avatar,
    context: req.body.context
  }
  db.Post.create(post)
  .then(function(data) {
     return db.User.findOneAndUpdate({_id: userId}, { $push: { post: data._id } }, { new: true });
  })
  .then(function(result) {
    res.json(result);
  })
  .catch(function(err) {
    res.json(err);
  });
});

/**
 * @description update post
 */
router.put('/updatepost', (req, res, next) => {
  const postId = req.body.postId;
  db.Post.findOne({ _id: req.body.postId}).then(post => { 
    
    ((req.body.selected.title !== '')&&(req.body.selected.title)) ? (post.title = req.body.selected.title) : 0;
    ((req.body.selected.subtitle !== '')&&(req.body.selected.subtitle))? (post.subtitle = req.body.selected.subtitle): 0;
    ((req.body.selected.context !== '' )&&(req.body.selected.context))? (post.context = req.body.selected.context) : 0;
    ((req.body.selected.imageAddress !== '')&&(req.body.selected.imageAddress))? (post.imageAddress = req.body.selected.imageAddress): 0;
    
    db.Post.findOneAndUpdate({ _id: postId }, {$set: {title: post.title, subtitle: post.subtitle, imageAddress: post.imageAddress, context: post.context }}).then((raw) => {
      
      db.Post.find({}).then((data) => {
        items.posts = data.reverse();
        if(req.user.access === 2){
            res.status(200).json({
             message: "the selected post updated successfully",
             user: req.user,
             items: items
           });
        }
        else
         if(req.user.access === 1){
         db.User.find({}).then((members) => {
           items.members = members.reverse(); 
           res.status(200).json({
             message: "the selected post updated successfully",
             user: req.user,
             items: items
           });
   
         }).catch(function(err) {
           res.json(items);
         });
        } 
      }); 
    })
    .catch(function(err) {
            res.json(err);
        });;
  });
});


/**
 * @description delete post
 */
router.delete('/deletepost/:id', (req, res) => {
  const chosen = req.params.id;
  db.Post.deleteOne({_id: chosen}).then((result) => {
    db.Post.find({}).then((data) => {
      items.posts = data.reverse();
      if(req.user.access === 2){
          res.status(200).json({
           message: "the selected post romoved successfully",
           user: req.user,
           items: items
         });
      }
      else
       if(req.user.access === 1){
       db.User.find({}).then((members) => {
         items.members = members.reverse(); 
         res.status(200).json({
           message: "the selected post romoved successfully",
           user: req.user,
           items: items
         });
 
       }).catch(function(err) {
         res.json(items);
       });
      }
     })
     .catch(function(err) {
       res.json(err);
     });


  })
  .catch(function(err){
    res.json(err);
  });
});

/**
 * @description delete user
 */
router.delete('/delete/:id', (req, res) => {
  const chosen = req.params.id;
  db.User.deleteOne({_id: chosen}).then((result) => {
    db.Post.find({}).then((data) => {
      items.posts = data.reverse();
      if(req.user.access === 2){
          res.status(200).json({
           message: "the selected user romoved successfully",
           user: req.user,
           items: items
         });
      }
      else
       if(req.user.access === 1){
       db.User.find({}).then((members) => {
         items.members = members.reverse(); 
         res.status(200).json({
           message: "the selected user romoved successfully",
           user: req.user,
           items: items
         });
 
       }).catch(function(err) {
         res.json(items);
       });
      }
     })
     .catch(function(err) {
       res.json(err);
     });


  })
  .catch(function(err){
    res.json(err);
  });
});



/**
  * @description upload new image for update product 
  * @param {String} id
*/
router.post('/upload', (req, res, next) => {
  let imageFile = req.files.file;
  const date = Date.now();
  const filenameSource = req.body.filename.split(".");
  const filename = filenameSource[0] + String(date);


    imageFile.mv(path.join(__dirname, `../public/${filename}.jpg`), function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      console.log('ax save shod')
      res.json(`${filename}.jpg`);
    });
});


/**
 * @description update post
 */
router.put('/update', (req, res, next) => {
  const userId = req.body.userId;
  db.User.findOne({ _id: req.body.userId}).then(userSelected => { 

    ((req.body.selected.name !== '')&&(req.body.selected.name)) ? (userSelected.name = req.body.selected.name) : 0;
    ((req.body.selected.email !== '')&&(req.body.selected.email))? (userSelected.email = req.body.selected.email): 0;
    ((req.body.selected.avatar !== '' )&&(req.body.selected.avatar))? (userSelected.avatar = req.body.selected.avatar) : 0;
    (req.body.selected.access)? (userSelected.access = req.body.selected.access) : 0;
    db.User.findOneAndUpdate({ _id: userId }, {$set: 
      {name: userSelected.name, email: userSelected.email, avatar: userSelected.avatar, access: userSelected.access}}).then((raw) => {
      console.log(raw)
      db.Post.find({}).then((data) => {
        items.posts = data.reverse();
        if(req.user.access === 2){
            res.status(200).json({
             message: "the selected user updated successfully",
             user: req.user,
             items: items
           });
        }
        else
         if(req.user.access === 1){
         db.User.find({}).then((members) => {
           items.members = members.reverse(); 
           res.status(200).json({
             message: "the selected user updated successfully",
             user: req.user,
             items: items
           });
   
         }).catch(function(err) {
           res.json(items);
         });
        } 
      }); 
    })
    .catch(function(err) {
            res.json(err);
        });;
  });
});

/**
 * @description add new activity to notification 
 */
router.post("/act", (req, res) => {
  const user = req.user;
  const newAct = {
    act: `${user.name}; ${req.body.act}`
  }
  db.Activity.create(newAct)
  .then(function(data) {
     return db.User.findOneAndUpdate({_id: user._id}, { $push: { activity: data._id } }, { new: true });
  })
  .then(function(result) {
    res.json(result);
  })
  .catch(function(err) {
    res.json(err);
  });
});

router.get('/act', (req, res) => {
  db.Activity.find({}).then((acts) => {
      items.act = acts.reverse();
        res.status(200).json({
         message: "all acivities",
         user: req.user,
         items: items
       })
      })
      .catch(function(err) {
        res.json(err);
      }); 
});

router.put('/act', (req, res, next) => {
  db.Activity.find({}).then(data => {
    data.forEach(e => {
      db.Activity.findOneAndUpdate({_id: e._id}, {$set: {isView: true}})
      .then((ret) => console.log(ret))
    })
    
    res.json({message: 'successfully'})
  }).catch(function(err) {
    res.json(err);
});;
});


module.exports = router;