import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup= async (req,res)=>{
    try {
        const {fullname,username,password,confirmpassword,gender}=req.body;
        if(password!==confirmpassword){
            return res.status(400).json({error:"Passwords do not match"});
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error:"Username already exists"});    
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);

        const boyprofilepic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlprofilepic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser= new User({
            fullname,
            username,
            password:hashedpassword,
            gender,
            profilepic : gender === "male"?boyprofilepic:girlprofilepic
        })

        if(newUser){
            await generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic
            
        });
        } else{
            return res.status(400).json({error:"Invalid User data"});
        }

    } catch (error) {
        console.log("Error in signup Controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};
export const login= async (req,res)=>{
        try {
            const {username,password}=req.body;
            const user = await User.findOne({username}); 
            const isPasswordCorrect = await bcrypt.compare(password,user?.password||" ");

            if(!user||!isPasswordCorrect){
                return res.status(400).json({error:"Invalid Credentials"});
            }
            generateTokenAndSetCookie(user._id,res);
            res.status(200).json({
                _id: user._id,
                fullname:user.fullname,
                username: user.username,
                profilepic: user.profilepic,
            });

        } catch (error) {
        console.log("Error in login Controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
        }
};

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxage:0});
        res.status(200).json({message:"Logout Succesfully."});

    } catch (error) {
        console.log("Error in login Controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};
