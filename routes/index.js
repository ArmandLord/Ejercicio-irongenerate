const express = require('express');
const router  = express.Router();
const bcryptjs = require('bcryptjs')

/* GET home page */
router.get('/', (req, res, next) => {
  
  if(req.session.count) {
    req.session.count += 1
  } else {
    req.session.count = 1
  }
  console.log(req.session.count)
  // //hashear contraseña de usuarios
  // const pwd = 'iron123'
  // //recomendable un valor entre 10 y 14 
  // const saltRounds = 10

  // const salt = bcryptjs.genSaltSync(saltRounds)

  // const hashPwd = bcryptjs.hashSync(pwd, salt)

  // console.log(hashPwd);

  res.render('index');
});



module.exports = router;
