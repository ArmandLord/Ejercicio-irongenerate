const express = require('express')
const { format } = require('morgan')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const User = require("../models/User")

router.get('/signup', (req, res) => {
  res.render("auth/signup")
})

router.post('/signup', async (req, res) => {
  // 1. tomar la información del form
  const { email, username, password } = req.body
  // 2. evaluar si pasaron campos vacios
  if(email === '' || username === '' || password === '' ){
    // 2.1 si es asi enviar mensaje de error
   return res.render('auth/signup', { error: 'Missing fields'})
  } else {
  //verificar si el correo ya est acreado
  const user = await User.findOne({ email })
  if(user){
    return res.render("auth/signup", { error: "something went wrong"})
  }
  // 3.hashear la contraseña 
  const salt = bcryptjs.genSaltSync(12)
  const hashpwd = bcryptjs.hashSync(password, salt)
  // 3.1 si la ifo es correcta crear usuario
  //4 guardar usuario en base de datos
  await User.create({
    username,
    email,
    password: hashpwd
  })
  //5. responder al usuario: redireccion a profile
  res.redirect("/profile")
  // res.send(req.body)
}
})

//ruta login
router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", async (req, res) => {
  // 1. tomar información del form
  const { email, password } = req.body
  // 2 evaluar si la info esta completa
  if(email === "" || password === ""){
    res.render('auth/login', { error: "Missing fields"})
  }
  // 3. buscar si existe el ususario que nos mandaron
  const user = await User.findOne({email})
  // 3.1 si no hay usuario notificar error
  if (!user) {
    res.render('auth/login', { error: 'something went grong'})
  }
  // 4. si existe la contraseña comparar con la de base datos
  if(bcryptjs.compareSync(password, user.password)){
    // 4.2 si conincide renderizamos profile
    // res.render('auth/profile', user)
    delete user.password
    req.session.currentUser = user
    res.redirect("/profile")
  } else {
    // 4.1 si no coincide hacer render error
    res.render('auth/login', { error: "something went wrong"})
  }
  // res.send(req.body)
})

router.get("/profile", (req, res) => {
  res.render('auth/profile', {user: req.session.currentUser})
})

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router