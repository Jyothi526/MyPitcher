
const mongoose = require('mongoose');
const inputSchema = new mongoose.Schema({
    inputType: String,
    inputQuestion: String,   //what will be shown in the form
    header: String,          //what will be shown in the pdf
    content: [String],
    tableData: [[String]],
    tableHeaders: [String],
    tableMaxRows: Number,
    tableMaxColumns: Number,
    options: [String],      //for <select> inputs
    required: Boolean,      //true if it is a required input
})
const pitchSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    company_logo: [String],
    tags: [String],
    tagsOptions: [String],
    inputs: [inputSchema],
    tags: [String],
    tagOptions: [String],
    teamDetails1: {
        imgpath: String,
        name: String,
        designation: String,
        linkedinUrl: String
    },
    teamDetails2: {

        imgpath: String,
        name: String,
        designation: String,
        linkedinUrl: String
    },
    teamDetails3: {

        imgpath: String,
        name: String,
        designation: String,
        linkedinUrl: String
    },
    teamDetails4: {

        imgpath: String,
        name: String,
        designation: String,
        linkedinUrl: String
    },
    teamDetails5: {

        imgpath: String,
        name: String,
        designation: String,
        linkedinUrl: String
    },

    share_link: {
        type: String
    }
})
mongoose.model('pitcher', pitchSchema);

