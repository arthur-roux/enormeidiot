const express = require("express");
const fs = require("fs");
const path = require("path")
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 3000;

// Use the express-fileupload middleware
app.use(fileUpload({
    createParentPath: true,
}));
app.use(express.static("public"));
app.use("/upload/", express.static("upload"));
app.use("/placeholder/", express.static("placeholder"));

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.set('upload', __dirname + '/upload');
app.set('placeholder', __dirname + '/placeholder');

function emptyDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filepath = path.join(directory, file);
        fs.unlinkSync(filepath);
    }
}



//TODO set to placeholder only if upload folder is empty
imagedir = "/placeholder/placeholder.png";
mytext = "ouais y'a quoi";

app.get('/', (req, res) => {
    
    res.render("index", {imagedir, mytext});
});

app.post('/upload', (req, res) => {
    mytext = req.body.textField;
    console.log(req.body.textField);
    // If no image submitted, exit
    if (!req.files) return res.redirect("/");

    //Get the file that was set to field named "image"
    const { image } = req.files;
    console.log("image: " + image.size);

    console.log(req.body.textField);


    
    //if not an image type, prevent from uploading
    //TODO use file-type to actually check the file (https://github.com/sindresorhus/file-type)
    //TODO add error message
    if (!/^image/.test(image.mimetype)) return res.redirect("/");

    //if too heavy, prevent from uploading
    //TODO add error message
    if (image.size >8000000) return res.redirect("/");

    //empty upload folder
    emptyDirectory(__dirname + "/upload/");

    // Move the uploaded image to our upload folder
    imagedir = "/upload/" + image.name;
    console.log("imagedir: " + imagedir);
    image.mv(__dirname + imagedir);

    //res.render("index", {imagedir});
    res.redirect("/");
});

app.post("/apropos", (req, res) => {
    res.render("apropos");
});

app.get("/test", (req, res) => {
    console.log("cliqué");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});