const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/usecontrollers");
const { requireAuth, checkIfUser } = require("../middleware/middleware");
const { check } = require("express-validator");
const multer  = require('multer')
const upload = multer({storage: multer.diskStorage({})});
router.get("*", checkIfUser);

router.get("/", user_start_get);
router.get("/activecompte", user_active_get);
router.get("/login", user_login_get);
router.get("/signup", user_signup_get);
router.get("/home", requireAuth, user_index_get);

router.get("/user/add.html", requireAuth, user_add_get);

router.get("/edit/:id", requireAuth, user_edit_get);

router.get("/user/:id", requireAuth, user_view_get);
router.get("/signout", user_logout_get);

router.put("/edit/:id", user_update_put);

router.delete("/edit/:id", user_delete_post);

router.delete("/:id", user_delete_post2);
router.post("/active/:id", user_activer_post);
router.post("/user/add.html", user_add_post);
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  user_signup_post
);
router.post("/login", user_login_post);
router.post("/editprofile",upload.single('avatar2'), user_editprofile_post);

module.exports = router;
