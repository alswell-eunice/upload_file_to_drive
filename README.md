## upload_file_to_drive
<p>This project contains a node backend program that receives file from a simple html form <em><strong>index.html</strong></em> through multer and
upload it to Google Drive using Google Drive API and the service account</p>

# Procedure:
- Sign into Google Cloud Console https://console.cloud.google.com.
- Enable Google Drive API and create a Service Account.
- Download the service credentials into your project directory and rename it as <em><strong>credentials.json</strong></em>.
- Create new folder using the <em> createFolder.js</em> file  or manually create a new folder in your Google Drive.
- Save the folder ID in the <em><strong>.env</strong></em>.
- Run your code and view <em><strong>index.html </strong></em> file in browser using http:localhost:<PORT>.
- OR use Postman to run you test.




