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
  console.log("this person is ", currentUser);
  res
    .status(200)
    .render("pages/homepage", { users: users, currentUser: currentUser });
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
  res.render("pages/profile", {
    user: foundUser,
    friends: userFriends,
    currentUser: currentUser,
  });
};

const handleSignin = (req, res) => {
  res.render("pages/signin", { currentUser: currentUser });
};

const nameLookUp = (req, res) => {
  const foundUser = users.find((user) => user.name === req.body.firstName);
  console.log(foundUser);
  // const urlUser = "users/" + foundUser._id;
  // console.log(urlUser);
  if (foundUser === undefined) {
    res.status(404).send("user doesnt exist :<");
  } else {
    const urlUser = "users/" + foundUser._id;
    console.log(urlUser);
    res.status(200).redirect(urlUser);
    currentUser = foundUser;
    console.log("current user is =", currentUser);
  }
};
// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")
  // form link
  .post("/getname", nameLookUp)
  // endpoints
  .get("/", handleHomepage)
  .get("/users/:_id", handleProfilePage)
  .get("/signin", handleSignin)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
