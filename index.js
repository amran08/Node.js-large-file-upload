
const express = require('express');         
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');              
const fs = require('fs-extra');            
 
const app = express(); // Initialize the express web server
app.use(busboy({
      highWaterMark: 10 * 1024 * 1024, // 10 MB buffer
}));
 
const uploadPath = path.join(__dirname, 'uploads/'); 
fs.ensureDir(uploadPath); 



app.route('/upload').post((req, res, next) => {
 
    req.pipe(req.busboy); // Pipe it trough busboy
 
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
 
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        
        file.pipe(fstream);
 
        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            res.redirect('back');
        });
    });
});
 
 
/**
 * Serve the basic index.html
 */
app.route('/').get((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});
 
const server = app.listen(3500, function () {
    console.log(`Listening on port ${server.address().port}`);
});
