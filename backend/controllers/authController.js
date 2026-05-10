const User = require("../models/User");
exports.register =async(req,res) =>{
try{
const {name, email, password} = req.body;
const userExists = await User.findOne({ email });
    if (userExists) {
    return res.status(400).json({ message: "Email déjà utilisé" });
    }     
const newUser = new User({ name, email, password });
await newUser.save();
res.status(201).json({ message: "Utilisateur enregistré avec succès" });
} catch (error) {
  console.error("Erreur lors de l'inscription :", error);
  res.status(500).json({ message: "Erreur serveur" });
}
}