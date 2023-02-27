const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require("validator");
const shortid = require('shortid');
const moment = require('moment');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongoose conn
mongoose.connect('mongodb+srv://Hotel:Hotel@cluster0.qqo0way.mongodb.net/Retvens', { useNewUrlParser: true });


//hotel owner's properties schema
const PropertySchema = new mongoose.Schema({

    owner_id: {
        type: String,

        required: false
    },

    trip_advisor_review: {
        type: Number,
        required: false
    },

    Google_review: {
        type: Number,
        required: false
    },
    hotel_id: {
        type: String,
        default: shortid.generate
    },

    profileImage: {
        type: String,
        
    },

    backgroundImage: {
        type: String,
        
    },

    hotel_name: {
        type: String,
        required: false
    },


    hotel_location: [{
        Latitude: String,
        Longitude: String
    }],
    hotel_stars: {
        type: Number,
        required: false
    },
    About: {
        type: String,
        required: false
    },
    Address: {
        type: String,
        required: false
    },
    Country: {
        type: String,
        required: false
    }

});

//function to validate email
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return re.test(email)
};

//hotel owner's schema
const HotelSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: false
    },

    Email: {
        type: String, required: false, validate: [validateEmail, 'Pls Enter valid email address'],
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    Password: {
        type: String,
        required: false
    },

    Phone: {
        type: Number,
        required: false
    },
    owner_id: {
        type: String,
        default: shortid.generate,
        required: false
    },
    token: {
        type: String,

    },
    Country: {
        type: String,
        required: false
    },

    profileImage: { type: String, required: false },

    backgroundImage: { type: String, required: false },

    Service_type: { type: String, required: false }

});


const Hotel_owner = mongoose.model('Hotel_owner', HotelSchema);
const Property = mongoose.model('Property', PropertySchema);



// get hotel owner's data
app.get('/hotelowner', (req, res) => {
    Hotel_owner.find({}, (error, blogposts) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(blogposts);
        }
    });
});

//get hotel owner's properties or hotels/restuarants
app.get('/property', (req, res) => {
    Property.find({}, (error, blogposts) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(blogposts);
        }
    });
});

//post hotel owner data
// app.post('/hotelowner', (req, res) => {
//     const blogpost = new Hotel_owner(req.body);
//     if (req.body.token == "abc123") {
//         blogpost.save()
//         res.send({ message: "Owner added succesfully" })
//     } else {
//         res.send({ message: "pls enter correct token" })

//     }

// });.




// app.post('/property', (req, res) => {
//     const blogpost = new Property(req.body);
//     blogpost.save((error) => {
//         if (error) {
//             res.status(500).send({ message: error.message });
//         } else {
//             res.send({ message: "Property added successfully" });
//         }
//     });
// });
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
const upload = multer({ storage: storage });


app.post('/property', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), async (req, res) => {
    const { owner_id, trip_advisor_review, Google_review, hotel_name, hotel_stars, About, Address, Country } = req.body;
    const { profileImage, backgroundImage } = req.files;
  
    const user = new Property({
      
      owner_id,
      trip_advisor_review,
      Google_review,
      hotel_name,
      hotel_stars,
      About,
      Address,
      Country,
      profileImage: profileImage[0].filename,
      backgroundImage: backgroundImage[0].filename
    });
  
    try {
      const savedUser = await user.save();
      res.status(201).json({message: "property added successfully"});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/hotelowner', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), async (req, res) => {
    const { Name, Email, Password, Phone, Country, Service_type } = req.body;
    const { profileImage, backgroundImage } = req.files;
  
    const user = new Hotel_owner({
      
      Name,
      Email,
      Password,
      Phone,
      Country,
      Service_type,
      profileImage: profileImage[0].filename,
      backgroundImage: backgroundImage[0].filename
    });
  
    try {
      const savedUser = await user.save();
      res.status(201).json({message: "Owner added successfully"});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


const Social_media = new mongoose.Schema({
    owner_id: {
        type: String,
        required: true
    },
    hotel_id: {
        type: String,
        required: true
    },
    social_media: {
        facebook: String,
        Twitter: String,
        Instagram: String,
        Linkedin: String,
        Pinterest: String,
        Whatsapp: String,
        Youtube: String,
        GMB: String
    }
});

const Social = mongoose.model('Social', Social_media)
module.exports = Social;



// social media api
app.post('/social', (req, res) => {
    const sm = new Social(req.body);
    sm.save((error) => {
        if (error) {
            res.status(500).send({ message: error.message });
        } else {
            res.send({ message: "social media added successfully" });
        }
    });
});


app.get('/social', (req, res) => {
    Social.find({}, (error, sm) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(sm);
        }
    });
});



const adminSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String, required: true, validate: [validateEmail, 'Pls Enter valid email address'],
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    Password: {
        type: String,
        required: true
    },
    Phone_no: {
        type: Number,
        required: true
    },
    Profile_photo: {
        type: String,
        required: true
    },
    User_id: {
        type: String, required: true,
    },
});

//admin model
const Admin = mongoose.model('Admin', adminSchema);

//admin data apis
app.post('/adminsignup', (req, res) => {
    const al = new Admin(req.body);
    al.save((error) => {
        if (error) {
            res.status(500).send({ message: error.message })
        }
        else {
            res.send({ message: "Registration Successful" });
        }
    })
});



app.get('/adminsignup', (req, res) => {
    Admin.find({}, (error, al) => {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.send(al);
        }
    })
});





const Restroschema = new mongoose.Schema({

    owner_id: {
        type: Number
    },
    restro_id: {
        type: Number,
        required: true
    },
    restraurant_profile_photo: {
        type: String,
        required: true
    },

    restaurant_name: {
        type: String,
        required: true
    },

    restaurant_location: {
        type: String,
        required: true
    },
    restaurant_type: {
        type: String,
        required: true
    },
    no_of_pax: {
        type: Number,
        required: true
    },

})

const restro_property = mongoose.model('restro_property', Restroschema);
module.exports = restro_property;
//Restaurant Post
app.post('/restro_property', (req, res) => {
    const blogpost = new restro_property(req.body);
    blogpost.save((error) => {
        if (error) {
            res.status(500).send({ message: error.message });
        } else {
            res.send({ message: "Restaurant added successfully" });
        }
    });
});

//Restaurant Get
app.get('/restro_property', (req, res) => {
    restro_property.find({}, (error, blogposts) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(blogposts);
        }
    });
});

const Social_Media = new mongoose.Schema({
    owner_id: {
        type: Number,
        required: true
    },
    restro_id: {
        type: Number,
        required: true
    },
    social_media: [{
        facebook: String,
        Twitter: String,
        Instagram: String,
        Linkedin: String,
        Pinterest: String,
        Youtube: String,
        GMB: String
    }],
});

const Social_restaurant = mongoose.model('Social_restaurant', Social_Media)
module.exports = Social_restaurant;



const companySchema = new mongoose.Schema({
    token: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String, required: true, validate: [validateEmail, 'Pls Enter valid email address'],
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    Password: {
        type: String,
        required: true
    },
    Phone_no: {
        type: Number,
        required: true
    },
    Profile_photo: {
        type: String,
        required: true
    },
    User_id: {
        type: String, required: true,
    },
});

//company model
const Company = mongoose.model('Company', companySchema);


app.post("/company", (req, res) => {
    const comp = new Company(req.body);
    comp.save((error) => {
        if (error) {
            res.status(500).send({ message: error.message })
        }
        else {
            res.send({ message: "Company added successfully" })
        }
    })
})



//company data
app.get('/company', (req, res) => {
    Company.find({}, (error, comp) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(comp);
        }
    });
});



app.post('/company', async (req, res) => {
    try {
        const prevDoc = await Company.findOne({}).sort({ _id: -1 });

        if (prevDoc.token !== req.body.token) {
            return res.status(400).json({ message: 'invalid data' });
        }
        const myDoc = new Company({
            token: req.body.token + 1,
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            Phone_no: req.body.Phone_no,
            Profile_photo: req.body.Profile_photo,
            User_id: req.body.User_id
        });
        const newDoc = await myDoc.save();
        res.status(201).json({ message: "Company added successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



const Hotel_work = new mongoose.Schema({
    owner_id: {
        type: Number,
        required: true
    },
    hotel_id: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    post_upload: {
        type: String,
        required: true
    },
    total_number_of_post: {
        type: Number,
        required: true
    },
    total_number_of_reels: {
        type: Number,
        required: true
    },
    total_number_of_stories: {
        type: Number,
        required: true
    },
    Google_reviews: {
        type: String,
        required: true
    },
    Tripadvisor_reviews: {
        type: String,
        required: true
    },
    Month_calender: {
        type: String,
        required: true
    }
});

const Hotel_Work = mongoose.model('Hotel_Work', Hotel_work);

app.get("/hotelwork", (req, res) => {
    Hotel_Work.find({}, (error, hm) => {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.send(hm)
        }

    })

})

app.post("/hotelwork", (req, res) => {
    const hm = new Hotel_Work(req.body);
    hm.save((error) => {
        if (error) {
            res.status(500).send({ message: error })
        }
        else {
            res.send({ message: "Hotel works added" })
        }
    })
})

app.get('/hotelwork/:hotel_id', (req, res) => {
    Hotel_Work.findOne({ hotel_id: req.params.hotel_id })
        .then(document => res.json(document))
        .catch(err => res.status(404).json({ success: false }));
});

const Restro_work = new mongoose.Schema({
    restro_id: {
        type: Number,
        required: true
    },

    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    post_upload: {
        type: String,
        required: true
    },
    total_number_of_post: {
        type: Number,
        required: true
    },
    total_number_of_reels: {
        type: Number,
        required: true
    },
    total_number_of_stories: {
        type: Number,
        required: true
    },
    Google_reviews: {
        type: String,
        required: true
    },
    Tripadvisor_reviews: {
        type: String,
        required: true
    }

});

const Restroant_Work = mongoose.model('Restroant_Work', Restro_work);

app.get("/restrowork", (req, res) => {
    Restroant_Work.find({}, (error, rw) => {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.send(rw)
        }

    })

})

app.post("/restrowork", (req, res) => {
    const rw = new Restroant_Work(req.body);
    rw.save((error) => {
        if (error) {
            res.status(500).send({ message: error })
        }
        else {
            res.send({ message: "restaurant works added successfully" })
        }
    })
});

//apis for updating
app.patch("/:resource/:id", async (req, res) => {
    if (req.params.resource === 'tasks') {
        const id = req.params.id;
        const updatetask = await All_task.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (updatetask) {
            res.send({ message: "successfully updated" });
        }
        else {
            res.send({ message: "something wrong" });
        }

    } else if (req.params.resource === 'property') {
        const id = req.params.id;
        const updateproperty = await Property.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (updateproperty) {
            res.send({ message: "successfully updated" });
        } else {
            res.send({ message: "something wrong" });
        }
    } else if (req.params.resource === 'hotelowner') {
        const id = req.params.id;
        const updatehotel = await Hotel_owner.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (updatehotel) {
            res.send({ message: "successfully updated" });
        } else {
            res.send({ message: "something wrong" });
        }
    } else if (req.params.resource === 'social') {
        const id = req.params.id;
        const updatesocial = await Social.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (updatesocial) {
            res.send({ message: "successfully updated" });
        } else {
            res.send({ message: "something wrong" });
        }
    } else {
        res.send({ message: "pls enter data for update" });
    }
})

const Task = new mongoose.Schema({
    hotel_name: {
        type: String,
        required: true
    },
    hotel_id: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        required: true
    },
    Date: {
        type: String,
        default: moment().format('DD-MM-YY')
    },
    facebook: {
        type: String,
        required: true

    },
    Linkedin: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: true
    },
    twitter: {
        type: String,
        required: true
    },

    Pinterest: {
        type: String,
        required: true
    },
    GMB: {
        type: String,
        required: true
    },
    Google_reviews: {
        type: String,
        required: true
    },
    owner_pic: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    }

})

const All_task = mongoose.model('All_task', Task)
module.exports = All_task;

//Post All_task
app.post('/tasks', (req, res) => {
    const comp = new All_task(req.body);
    comp.save((error) => {
        if (error) {
            res.status(500).send({ message: error });
        } else {
            res.send({ message: "task added successfully" });
        }
    });
});

//Get All_task
app.get('/tasks', (req, res) => {
    All_task.find({}, (error, comp) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(comp);
        }
    });
});


//get tasks using date or hotelid or status
app.get('/tasks/:key', async (req, res) => {
    let data = await All_task.find({
        "$or": [
            { "Date": { $eq: req.params.key } },
            { "hotel_id": { $eq: req.params.key } },
            { "Status": { $eq: req.params.key } },
            { "owner_id": { $eq: req.params.key } }]

    })
    res.send(data)
});


const countries = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Country_photo: {
        type: String,
        required: true
    }


});

const Country = mongoose.model('Country', countries)
module.exports = Country;

app.get('/Country', (req, res) => {
    Country.find({}, (error, blogposts) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(blogposts);
        }
    });
});

//Post country
app.post("/Country", (req, res) => {
    const hm = new Country(req.body);
    hm.save((error) => {
        if (error) {
            res.send(500).send(error)
        }
        else {
            res.send({ message: "Country added successfully" })
        }
    })
});

app.get('/restrowork/:restro_id', (req, res) => {
    Restroant_Work.findOne({ restro_id: req.params.restro_id })
        .then(document => res.json(document))
        .catch(err => res.status(404).json({ success: false }));
});

//get specific restarant property
app.get('/restro_property/:owner_id', (req, res) => {
    restro_property.findOne({ owner_id: req.params.owner_id })
        .then(document => res.json(document))
        .catch(err => res.status(404).json({ success: false }));
});


//get specific data of admin from userid
app.get('/adminsignup/:User_id', (req, res) => {
    Admin.findOne({ User_id: req.params.User_id })
        .then(document => res.json(document))
        .catch(err => res.status(404).json({ success: false }));
});

app.get('/hotelowner/:key', async (req, res) => {
    let data = await Hotel_owner.find({
        "$or": [

            { "Country": { $eq: req.params.key } },
            { "owner_id": { $eq: req.params.key } }]

    })
    res.send(data)
});

//api for login
app.post("/login", (req, res) => {
    const { Email, Password } = req.body
    Hotel_owner.findOne({ Email: Email }, (error, user) => {
        if (user) {
            if (Password === user.Password) {
                var owner_id = user.owner_id;
                res.send({ message: "Owner login successful", owner_id })

            } else {

                res.send({ message: "pls check your email and password" });
            }

        } else if (!user) {
            const { Email, Password } = req.body
            Admin.findOne({ Email: Email }, (error, data) => {
                if (data) {
                    if (Password === data.Password) {
                        res.send({ message: "Admin login successful" })
                    } else {

                        res.send({ message: "pls check your email and password" })
                    }

                } else if (!data) {
                    const { Email, Password } = req.body
                    Company.findOne({ Email: Email }, (error, com) => {
                        if (com) {
                            if (Password === com.Password) {
                                res.send({ message: "Company login successful" })
                            } else {

                                res.send({ message: "pls check your email and password" })
                            }

                        } else {
                            res.send({ message: "pls check your email and password" })
                        }
                    })

                }
            })
        } else {
            res.send({ message: "incorrect data" })
        }

    })

})

//get property using hotelif and oener id
app.get('/property/:key', async (req, res) => {
    let data = await Property.find({
        "$or": [

            { "hotel_id": { $eq: req.params.key } },
            { "owner_id": { $eq: req.params.key } }]

    })
    res.send(data)
});

//get specific data from social media using owner_id of hotel/restuarant owner's hotel
app.get('/social/:hotel_id', (req, res) => {
    Social.findOne({ hotel_id: req.params.hotel_id })
        .then(document => res.json(document))
        .catch(err => res.status(404).json({ success: false }));
});



const PORT = 3000;
app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000');
});