const User= require("../models/user.js");

module.exports.renderSignup=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser= new User({email,username});
        const registereduser=await User.register(newUser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to NestNGo!!");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.Login=async (req, res) => {
    req.flash("success","Welcome to NestNGo!You're logged in.");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.Logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!!");
        res.redirect("/listings");
    })
}