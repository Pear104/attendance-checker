const userController = {
  // > [GET] /user/find
  find: (req, res) => {
    res.send("Found a user");
  },
};

module.exports = userController;
