const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');

//Profile Model
const Profile = require('../../models/Profile');

// Validate Post Input
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    tests posts route
// @access  public
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts/
// @desc    Get Posts
// @access  public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404)
      .json({ nopostsfound: 'No posts found.' }));
});

// @route   GET api/posts/:id
// @desc    Get Post by id
// @access  public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404)
      .json({ nopostfound: 'No posts found with that ID.' }));
});

// @route   POST api/posts/
// @desc    Create Post
// @access  private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  //console.log(req); testing

  // Check Validation
  if (!isValid) {
    // Return errors with 400 status
    res.status(400)
      .json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    user: req.user.id,
    name: req.body.name,
    avatar: req.body.avatar
  });

  newPost.save()
    .then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401)
              .json({ notauthorized: 'User not authorized.' });
          }

          // Delete
          post.remove()
            .then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404)
          .json({ nopostfound: 'No posts found with that ID.' }));
    })
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0) {
            return res.status(400)
              .json({ alreadyLiked: 'User already liked this post.' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save()
            .then(post => res.json(post));
        })
        .catch(err => res.status(404)
          .json({ nopostfound: 'No posts found with that ID.' }));
    })
});
module.exports = router;