const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/vendor"));
app.use(express.static("public/fonts"));
app.use(express.static("views/images"));
app.use(express.static("public/scss"));

// app.use(express.static("public/images"));
app.use(bodyParser.urlencoded({ extended: false }));

let mongoConnectLink = "mongodb+srv://admin:admin@cluster1-qpxit.gcp.mongodb.net/test?retryWrites=true&w=majority";
    mongoose.connect(mongoConnectLink, {
    useNewUrlParser: true
});
mongoose.set("useCreateIndex",true);

const Schema = mongoose.Schema;

// Creating the user Schema for user collection model
const hospitalSchema = new Schema({
    name: String,
    email: {
        type: String,
        index: {
            unique: true,
            dropDups: true
        }
    },

    username: {
        type: String,
        index: {
            unique: true,
            dropDups: true
        }
    },
    donorId: [{ type: Schema.Types.ObjectId, ref: 'Donor' }],
    password: String,
    repassword: String,
    date: Date,
});

const Hospital = mongoose.model("hospital", hospitalSchema);


const donorSchema = new Schema({
    name : String,
    phone: Number,
    dob: String,
    gender: String,
    email: String,
    bloodGroup: String,
    date: Date,
    
});

const Donor = mongoose.model('Donor', donorSchema);

app.get("/", (req,res) => {
    res.sendFile("/home/sebstin_tom/Desktop/log2/Login_v13/views/landing.html");
});

app.get("/signup", (req,res) => {
    res.sendFile("/home/sebstin_tom/Desktop/log2/Login_v13/views/signup.html");
});

app.post("/signup", (req,res) => {
    const params = {
        'name': req.body.name,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.passwd,
        'repassword': req.body.repeatpass,
        'date': new Date()
    }
    console.log(params);
    const hospitalData = new Hospital(params);

    hospitalData.save().then(() => console.log("Hospital's data is written!"));

})

app.get("/login", (req,res) => {
    res.sendFile("/home/sebstin_tom/Desktop/log2/Login_v13/views/login.html");
});

app.post("/login", (req,res) => {
    const params = {
        'username': req.body.username,
        'password': req.body.passwd,    
    }
    console.log(params);
    const hospitalData = new Hospital(params);

    Hospital.find(params).then(results => {
        console.log(results);
        if(results.length){
            res.sendFile("/home/sebstin_tom/Desktop/log2/Login_v13/views/dash.html");
        }else{
            res.redirect("/login");
        }
    });
});

app.get("/addDonor", (req,res) => {
    res.sendFile("/home/sebstin_tom/Desktop/log2/Login_v13/views/donorform.html")
});

app.post("/addDonor", (req,res) => {
    const params = {
        'name' : req.body.donorname,
        'phone': req.body.phone,
        'email': req.body.email,
        'bloodGroup': req.body.bloodgrp,
        'dob': req.body.dob,
        'gender': req.body.gender,
        'date': new Date()
    }

    donorData = new Donor(params)
    donorData.save().then((result) => {
        console.log(result)
        // Hospital.donorId.push(result._id)
        // Hospital.save(done);
        // Hospital.findOneAndUpdate()
        // const newMessage = {
        //     donorId: result._id,
        //     // message: message
        // };
    
        query = {username: 'terence'},
        update = {
            // $set: {adID: id},
            $push: {donorId: result._id}
        },
        options = {upsert: true};
    
        Hospital.findOneAndUpdate(query, update, options, function (err, oldChat){
            if(err){
                console.log(err);
            }else{
                if(!oldChat){
                    Hospital.create({donorId: [result._id]}, function(err,newChat){
                        // var redirectLink = "/ad/details/".concat(id);
                        //     res.redirect(redirectLink);
                        res.send("user added");
                    });
                }else{
                    // var redirectLink = "/ad/details/".concat(id);
                    //         res.redirect(redirectLink);
                    res.send("user added");

                }
            }
        });
    });
    // hospitalData.save().then(() => console.log("Hospital's data is written!"));

})


app.listen(4000, () => console.log("App listening on port 4000"))


