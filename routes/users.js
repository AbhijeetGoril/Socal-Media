const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../modles/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(501).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(501).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all users
//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      res.status(202).json("user has been followed");
    } else {
      res.status(403).json("You already follow this user");
    }
  } else {
    res.status(403).json("You cant follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      res.status(202).json("user has been unfollowed");
    } else {
      res.status(403).json("You don't unfollow this user");
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
});
router.get("/", (req, res) => {
  res.send("hey its user route");
});

module.exports = router;
