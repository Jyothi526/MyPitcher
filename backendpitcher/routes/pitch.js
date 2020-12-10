//routes for pitcher schema
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()
const User = mongoose.model('user')
const Pitcher = mongoose.model('pitcher')
const nodemailer= require('nodemailer')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const jhelper = require('../configuration/jhelper');
const ghelper = require('../configuration/passport-oauth');
const JWT_KEY = "jwtactive987";
const exhbs = require('express-handlebars');
const blankTemplate = require('../blankTemplate.json');
const Handlebars=require('handlebars');


//isAuth function protects the routes
function isAuth(req, res, next) {
    var uid = JSON.parse(req.body.userdata);
    console.log("Trying to AUTH request with accesstoken:", uid);
    User.findOne({ accessToken: uid['accessToken'] }).then((user) => {
        console.log("inside isauth")
        if (user) {
            console.log("User access token is valid, next");
            console.log(user)
            return next();
        }
        else {
            console.log("No user found with this token");
            return res.sendStatus(401);
        }

    });
}


//Using multer to store the images
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "uploads");
    },
    filename: (req, file, callBack) => {
        var datetime = new Date();
        console.log(datetime.toISOString().slice(0, 19).replace(/:/g, '_'));
        const suffix =
            datetime.toISOString().slice(0, 19).replace(/:/g, "_") +
            file.originalname.replace(/\ /g, "_");
        callBack(null, 'PITCHER' + suffix);
    },
});

const upload = multer({ storage: storage });

//end point logic to add a pitch into the database
router.post('/addpitch', upload.any(),isAuth ,(req, res) => {
    
    var img1,img2,img3,img4,img5;
    logosArr=[];
    const files = req.files;

    for (var i = 0; i < files.length; i++) {
     
        if (files[i].fieldname == 'logo') {
            logosArr.push(files[i].path);

        }
        if (files[i].fieldname == 'Teamfile1') {
            img1=files[i].path;
        }
        if (files[i].fieldname == 'Teamfile2') {
            img2=files[i].path;
        }
        if (files[i].fieldname == 'Teamfile3') {
            img3=files[i].path;

        }
        if (files[i].fieldname == 'Teamfile4') {
            img4=files[i].path;
        }
        if (files[i].fieldname == 'Teamfile5') {
            img5=files[i].path;
        }
    }
    teamDetails1=JSON.parse(req.body.teamDetails1),
    teamDetails1.imgpath=img1;
    teamDetails2=JSON.parse(req.body.teamDetails2),
    teamDetails2.imgpath=img2;
    teamDetails3=JSON.parse(req.body.teamDetails3),
    teamDetails3.imgpath=img3;
    teamDetails4=JSON.parse(req.body.teamDetails4),
    teamDetails4.imgpath=img4;
    teamDetails5=JSON.parse(req.body.teamDetails5),
    teamDetails5.imgpath=img5;

    var inputArr=[];
    for (i in req.body.inputs){
        var actualInputObj = JSON.parse(req.body.inputs[i])

        
        if (actualInputObj['InputType']=='table'){
            console.log('Table is:',actualInputObj)
            inputArr.push(actualInputObj)
        }
        else{
            inputArr.push(actualInputObj)
        }
    }
    new Pitcher({
        email:req.body.email,
        documentName:req.body.documentName,
        inputs:inputArr,
        company_logo:logosArr,
        tags:req.body.tags,
        tagOptions:req.body.tagOptions,
        teamDetails1:teamDetails1,
        teamDetails2:teamDetails2,
        teamDetails3:teamDetails3,
        teamDetails4:teamDetails4,
        teamDetails5:teamDetails5,
    }).save().then((data)=>{
        console.log('Pitch added successfully:',data);
        res.json({"result":"ok"})
    })

});


//end point logic to convert html document to pdf

router.post('/pdfGenerator',isAuth, (req, res) => {
    Pitcher.findById(req.body.pid).then((currPitch)=>{
        if(currPitch){
          const  data = JSON.parse(JSON.stringify(currPitch));
          var isPitchFilled = validatePitch(data);
   
            
            if(isPitchFilled){
            const compile = async function (templateName, data) {
                const filepath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
                const html = await fs.readFile(filepath, 'utf-8');
                return hbs.compile(html)(data);
            };
            (async function () {
                try {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    const content = await compile('shots', data);
                    await page.setContent(content);
                    await page.pdf({
                        path: "Documents/"+data._id + '.pdf',
                        printBackground: true
                    });
                    console.log('done');
                    res.json({ "result": "PDF Generated" });
                }
                catch (e) {
                    console.log('our error', e);
                }
            
            })();
        }
        else{
            console.log("pitch is not filled completely");
            res.json({"result":'fill the pitch completely to generate pdf'});
        }
        }
        else{
            res.json({"result":'Pitch Not Found'})
        }
    })
}) 

function validatePitch(filledPitch){
    console.log("tooo")
    var actualTrue=0,filledTrue=0;

    for(i in filledPitch.inputs){
        if(filledPitch.inputs[i]['required']==true){
         actualTrue=actualTrue+1;
        }
     }
    for(i in filledPitch.inputs){
       if(filledPitch.inputs[i]['required']==true){
           if(filledPitch.inputs[i]['content']!=""){
        filledTrue=filledTrue+1;
           }
       }
    }
    console.log("required true fields are:",actualTrue);
    console.log("filled true fields are:",filledTrue);
    if(actualTrue==filledTrue){
        return true;
    }
    else{
        return false;
    }
}

//end point logic to get template 
router.post('/gettemplate', (req, res) => {
    res.json(blankTemplate);
})

//end point logic to getallpitches from the database
router.get('/getallpitches', (req, res) => {
    console.log("Inside getallpitches")
    Pitcher.find((err, pitchers) => {
        if (err)
            res.send(err)
        else
            res.json(pitchers)
    })
});

//end point logic to send pdf to user mail.
router.post('/sendPdf',isAuth,(req,res)=>{
    let email=req.body.email;
    let docname=req.body.pid;
    const output=`<h2>Your Pitcher is ready find it in the attachments section</h2>`
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "lemonteam.pitcher@gmail.com",
            pass: "pitcheR@123",
        },
    });

    // send mail with defined transport object
    const mailOptions = {
        from: '"Team_Lemon" <lemonteam.pitcher@gmail.com>', // sender address
        to: email, // list of receivers
        attachments:[{
            path:`Documents/${docname}`+'.pdf'
        }],
        subject: "Pitcher", // Subject line
        html:output  // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({status:false,msg:'Pdf not found Generate First..'});
        }
        else {
            res.json({status:true,msg:"Pdf sent to your Mail"});
        }
    })
})


//end point logic to get the pitch through id from the database

router.post('/getwithid', (req, res) => {
    console.log("inside pitch email",req.body.userdata)
    const pid=req.body.pid
    Pitcher.findById(pid, (err, pitchers) => {
        if (err)
            res.send(err)
        else
        {
            res.json(pitchers);

        }
    })
});

//endpoint logic to view a pitch through id from the database
router.post('/getwithidforview', (req, res) => {
               udata=JSON.parse(req.body.userdata);
    const pid=req.body.pid
    Pitcher.findById(pid, (err, pitchers) => {
        if (err)
            res.send(err)
        else
        {   if(udata['email']===pitchers['email'])
            res.json(pitchers);
            else{
                res.json(false);
            }
        }
    })
});

//endpoint logic to delete the pitch through id from the database

router.delete('/deletepitch/:id',(req, res) => {
    console.log("inside delete pitch method")
    const path=`Documents/${req.params.id}`+'.pdf';
    Pitcher.findByIdAndDelete(req.params.id, (err, pitchers) => {
        if (err)
            res.send(err)
        else {
            fs.unlinkSync(path);
            //res.json(pitchers)
            return res.json({ result: "ok", message: 'Deleted successfully' });
        }
    })
});

//end point logic to get the pitches through the email

router.post('/getbyemail',isAuth, (req, res) => {
    const headerElements = []
    console.log("User data is:",req.body.userdata);
    console.log("Getting all pitches of user:",req.body.email)
    Pitcher.find({ email: req.body.email }, (err, pitchers) => {
        if (err)
            res.send(err)
        else
        {
            res.json(pitchers);
        }
    })
});

//end point logic to delete logo of pitch through the id

router.post('/deleteLogo',isAuth,(req,res)=>{
    console.log("deleting logo",req.body.userdata);
    const pid=req.body.pid
    Pitcher.findById(pid, (err, pitchObj) => {
        if (err) {
            res.send(err)
        }
        else{
            var imgloc=pitchObj['company_logo'][0]
            pitchObj.set("company_logo",[]).save()
            fs.unlinkSync(imgloc, (err) => {
                if (err) {
                    console.log(err);
                    res.json({ result: "ERROR: Delete failed" });
                    return;
                } else {

                    res.json({ result: "ok" });
                    return;
                }
                //file removed
            });
            res.json({ result: "ok" });
        }
        
    })
})

//end point logic to delete image of team through the id
router.post('/deleteImage',isAuth,(req,res)=>{
    console.log("deleting team images",req.body.userdata);
    const pid=req.body.pid
    const teamDetails=req.body.teamDetails
    Pitcher.findById(pid, (err, pitchObj) => {
        if (err) {
            res.send(err)
        }
        else{
            var imgloc=pitchObj[teamDetails]['imgpath']
            pitchObj[teamDetails]['imgpath']='';
            pitchObj.save();
            fs.unlinkSync(imgloc, (err) => {
                if (err) {
                    console.log(err);
                    res.json({ result: "ERROR: Delete failed" });
                    return;
                } else {

                    res.json({ result: "ok" });
                    return;
                }
                //file removed
            });
            res.json({ result: "ok" });
        }
        
    })
})

//end point logic to update the details of pitch through the id
router.post('/updatepitch', upload.any(),isAuth, (req, res) => {
    

    Pitcher.findById(req.body.pid).then((currPitch)=>{
        if(currPitch){
            logosArr=[];
            var img1,img2,img3,img4,img5;
            const files = req.files;
            if(currPitch['company_logo'].length==0){
                for (var i = 0; i < files.length; i++) {
                    if (files[i].fieldname == 'logo') {
                        logosArr.push(files[i].path);
                    }
                }
            }
            else{
                logosArr= currPitch['company_logo']
            }
            if(!currPitch['teamDetails1']['imgpath']){
                 for(var i = 0; i < files.length; i++) {
                     if (files[i].fieldname == 'Teamfile1') {
                         img1=files[i].path;
             
                     }
            }
            }
            else{
              img1=currPitch['teamDetails1']['imgpath']
            }
            if(!currPitch['teamDetails2']['imgpath']){
                 for(var i = 0; i < files.length; i++) {
                     if (files[i].fieldname == 'Teamfile2') {
                         img2=files[i].path;
             
                     }
            }
            }
            else{
              img2=currPitch['teamDetails2']['imgpath']
            }
            if(!currPitch['teamDetails3']['imgpath']){
                for(var i = 0; i < files.length; i++) {
                    if (files[i].fieldname == 'Teamfile3') {
                        img3=files[i].path;
            
                    }
            }
            }
            else{
             img3=currPitch['teamDetails3']['imgpath']
            }if(!currPitch['teamDetails4']['imgpath']){
             for(var i = 0; i < files.length; i++) {
                if (files[i].fieldname == 'Teamfile4') {
                    img4=files[i].path;
        
                }
            }
            }
            else{
                  img4=currPitch['teamDetails4']['imgpath']
                }
            if(!currPitch['teamDetails5']['imgpath']){
                    for(var i = 0; i < files.length; i++) {
                        if (files[i].fieldname == 'Teamfile5') {
                            img5=files[i].path;
                
                        }
               }
               }
            else{
                 img5=currPitch['teamDetails5']['imgpath']
               }
               teamDetails1=JSON.parse(req.body.teamDetails1),
               teamDetails1.imgpath=img1;
               teamDetails2=JSON.parse(req.body.teamDetails2),
               teamDetails2.imgpath=img2;
               teamDetails3=JSON.parse(req.body.teamDetails3),
               teamDetails3.imgpath=img3;
               teamDetails4=JSON.parse(req.body.teamDetails4),
               teamDetails4.imgpath=img4;
               teamDetails5=JSON.parse(req.body.teamDetails5),
               teamDetails5.imgpath=img5;

            var inputArr = [];
            for (i in req.body.inputs) {
                var actualInputObj = JSON.parse(req.body.inputs[i])

                if (actualInputObj['InputType'] == 'table') {
                    console.log('Table is:', actualInputObj)
                    inputArr.push(actualInputObj)
                }
                else {
                    inputArr.push(actualInputObj)
                }
            }
            for(i in req.body.teamDetails){
                var actualTeamDetails=JSON.parse(req.body.teamDetails[i])
                teamDetailsArr.push(actualTeamDetails);
            }

            currPitch.set('documentName',req.body.docName)
            currPitch.set('inputs',inputArr)
            currPitch.set('tags',req.body.tags)
            currPitch.set('teamDetails1',teamDetails1);
            currPitch.set('teamDetails2',teamDetails2);
            currPitch.set('teamDetails3',teamDetails3);
            currPitch.set('teamDetails4',teamDetails4);
            currPitch.set('teamDetails5',teamDetails5);
            currPitch.set('company_logo',logosArr).save()
            res.json({"result":"ok"})

        }
        else{
            res.json({"result":"Pitch not found!"})
        }
    })


})

//end point logic to get the share link of pitch through the id
router.post('/getlink', (req, res) => {
    pid = req.body.pid;

    Pitcher.findById(req.body.pid).then((currPitch)=>{
        if(currPitch){
          const  data = JSON.parse(JSON.stringify(currPitch));
          var isPitchFilled = validatePitch(data);
       if(isPitchFilled){
    const token = jwt.sign({pid }, JWT_KEY, {});
    const CLIENT_URL = 'http://' + req.headers.host;
    res.json({"result":`${CLIENT_URL}/pitch/getpdf/${token}`,"isFilled":true});
       }
       else{
        res.json({"result":"Please compltely fill the Pitch Form via the Edit button","isFilled":false});
       }

      }
})
})

//endpoint to handle the sharable link
router.get('/getpdf/:token',(req, res) => {
    const token = req.params.token;
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedtoken) => {
            if (err) {
                console.log("link expired ask user to generate it again");
            }
            else {

                const { pid } = decodedtoken;
                
                res.sendFile(process.cwd()+"/Documents/"+`${pid}`+".pdf");
               
            }
        })
    }
})

//Handlebar helpers
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifNull', function(v1, v2, options) {
    if(v1 === v2) {
      return options.inverse(this);
    }
    return options.fn(this);
  });  
  Handlebars.registerHelper('ifImg', function(v1) {
      const logo_path=JSON.parse(JSON.stringify(this.company_logo[0]));
      
      return process.env.BACKEND_URL+logo_path;

 });

 Handlebars.registerHelper('ifNotEquals', function(v1, v2, options) {
    if(v1 === v2) {
      return options.inverse(this);
    }
    return options.fn(this);
  });

  Handlebars.registerHelper('ifTeam1Img', function(v1) {
    const team1_path=JSON.parse(JSON.stringify(this.teamDetails1.imgpath));
    return process.env.BACKEND_URL+team1_path;

});

Handlebars.registerHelper('ifTeam2Img', function(v1) {
    const team2=JSON.parse(JSON.stringify(this.teamDetails2.imgpath));
    return process.env.BACKEND_URL+team2;
});

Handlebars.registerHelper('ifTeam3Img', function(v1) {
    const team3=JSON.parse(JSON.stringify(this.teamDetails3.imgpath));
    
    return process.env.BACKEND_URL+team3;

});
Handlebars.registerHelper('ifTeam4Img', function(v1) {
    const team4=JSON.parse(JSON.stringify(this.teamDetails4.imgpath));
    return process.env.BACKEND_URL+team4;

});
Handlebars.registerHelper('ifTeam5Img', function(v1) {
    const team5=JSON.parse(JSON.stringify(this.teamDetails5.imgpath));
    return process.env.BACKEND_URL+team5;

});  
module.exports = router;