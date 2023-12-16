const User = require("../models/customerSchema");
const UserAuth = require("../models/userSchema");
var moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const Nodemailer = require("../nodemailer/nodemailer");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const user_login_get = (req, res) => {
  res.render("auth/login");
};
const user_active_get = (req, res) => {
  res.render("activecompte");
};

const user_signup_get = (req, res) => {
  res.render("auth/signup");
};

const user_start_get = (req, res) => {
  res.render("welcome");
};

const user_index_get = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "houaribelsaadidev", (err, decoded) => {
      if (err) {
        res.locals.user = null;
      } else {
        // const currentUser = await UserAuth.findById(decoded.id);

        User.find({ iduser: decoded.id })
          .then(async (result) => {
            res.render("index", { arr: result, moment: moment });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
};

const user_add_get = (req, res) => {
  res.render("user/add");
};

const user_edit_get = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  // result ==> object
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_update_put = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_delete_post = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_delete_post2 = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_add_post = (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      // res.redirect("/home");
      res.json({ id: user.id });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_signup_post = async (req, res) => {
  const objError = validationResult(req);
  if (objError.errors.length > 0) {
    return res.json({ arrvalidatorError: objError });
  }

  const isCurrentEmail = await UserAuth.findOne({ email: req.body.email });
  if (isCurrentEmail) {
    return res.json({ emailexiste: "Email already exist" });
  }
  const user = new UserAuth(req.body);
  user
    .save()
    .then(() => {
      // res.redirect("/login");
      // location.assign("/login");
      Nodemailer(req.body.email);
      res.json({ id: user.id });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_login_post = async (req, res) => {
  try {
    const verification = await UserAuth.findOne({ email: req.body.email });
    if (!verification.confirmed) {
      return console.log("veuiller activer votre compte");
    }
    if (verification == null) {
      res.json({ emailnotfound: "Email not found" });
    } else {
      const match = await bcrypt.compare(
        req.body.password,
        verification.password
      );
      if (match) {
        var token = jwt.sign({ id: verification._id }, "houaribelsaadidev");
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        // res.redirect("/home");
        res.json({ id: verification._id });
      } else {
        res.json({ wrongpassword: "wrong password" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const user_logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const user_editprofile_post = (req, res) => {
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "houaribelsaadidev", async (err, decoded) => {
        if (err) {
          res.locals.user = null;
        } else {
          const imageasupprimer = await UserAuth.findById(decoded.id);

          const avatar = await UserAuth.updateOne(
            { _id: decoded.id },
            { img: result.secure_url, public_id: result.public_id }
          )

            .then((resultt) => {
              cloudinary.uploader.destroy(
                imageasupprimer.public_id,
                (error, result) => {
                  console.log("---------------------------");
                  console.log("ok delete");
                }
              );
              res.redirect("/home");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
};

const user_activer_post = async (req, res) => {
  UserAuth.findByIdAndUpdate({ _id: req.params.id }, { confirmed: true })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  user_start_get,
  user_login_get,
  user_signup_get,
  user_index_get,
  user_add_get,
  user_edit_get,
  user_view_get,
  user_update_put,
  user_delete_post,
  user_delete_post2,
  user_add_post,
  user_signup_post,
  user_login_post,
  user_logout_get,
  user_editprofile_post,
  user_activer_post,
  user_active_get,
};
