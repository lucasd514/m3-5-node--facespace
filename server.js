"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
// create pages
const handleHomepage = (req, res) => {
  console.log(req.params);
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  // console.log(users);
  const userID = req.params._id;
  //find constant
  const foundUser = users.find((user) => user._id === userID);
  console.log(foundUser);
  // user friends
  console.log(foundUser.friends);
  const userFriends = foundUser.friends.map((friendID) => {
    return users.find((userObj) => {
      return userObj._id == friendID;
    });
  });
  res.render("pages/profile", { user: foundUser, friends: userFriends });
};
// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:_id", handleProfilePage)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
