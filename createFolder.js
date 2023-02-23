const express = require('express');
const {google} = require('googleapis');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILEPATH,
    scopes: process.env.SCOPES,
});

const drive = google.drive({ version: "v3", auth});

const fileMetadata = {
    'name': 'file-submission',
    'mimeTypes': 'application/vnd.google-apps.folder',
};

drive.files.create({
    resource: fileMetadata,
    fields: 'id',
})
.then((response) => {
    console.log(response);
    console.log(response.data.id);
    setPermission(response.data.id);
})
.catch((err) => {console.log(err)});

const setPermission = (fileId) => {
    drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        }
    })
    .then((res) => {})
    .catch((err) => {console.log(err)});
};