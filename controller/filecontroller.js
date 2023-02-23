require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const KEYFILEPATH = path.join(__dirname, "../credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES, 
});

const driveService = google.drive({ version: "v3", auth});

// controller to upload files
const uploadFile = async (req, res) => {
  const file = req.file;
  console.log(req.file);

  try {
    // as the file name stored is gibberish with no extension, that file is replaced by the original filename
    await fs.promises.rename(
      file.destination + "/" + file.filename,
      file.destination + "/" + file.originalname
    );

    const metaData = {
      name: file.originalname.substring(
        0,
        file.originalname.lastIndexOf(".")
      ),
      parents: [process.env.FOLDER_ID], // the ID of the folder you get from createFolder.js is used here
    };

    const media = {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.destination + "/" + file.originalname), // the file sent through multer will be uploaded to Drive
    };

    // uploading the file
    const response = await driveService.files.create({
      resource: metaData,
      media: media,
      fields: "id",
    });

    console.log("ID:", response.data.id);

    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getAllFiles = async (req, res) => {
  try {
    const q = `'${process.env.FOLDER_ID}' in parents`;
    const response = await driveService.files.list({
      q: q, // comment this if you want all possible files
      fields: "files(id, name)",
    });
    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
};

const deleteFile = async (req, res) => {
  const fileId =req.body.fileId; // the file to delete
  const response = await driveService.files.delete({
    'fileId': fileId,
    parentId: `${process.env.FOLDER_ID}`,
  });
  res.send(response);
};

const updateFile = async (req, res) => {
  try {
    const file = req.file; // the file to replace with
    const fileId = req.body.fileId; // the file to be replaced
    await fs.promises.rename(
      file.destination + "/" + file.filename,
      file.destination + "/" + file.originalname
    );
    const media = {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.destination + "/" + file.originalname), // the image sent through multer will be uploaded to Drive
    };

    const response = await driveService.files.update({
      resource: { name: file.originalname },
      addParents: `${process.env.FOLDER_ID}`,
      fileId: fileId,
      media: media,
      fields: "id",
    });

    res.send(response);
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  uploadFile: uploadFile,
  deleteFile: deleteFile,
  updateFile: updateFile,
  getAllFiles: getAllFiles,
};