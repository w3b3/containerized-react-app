import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = process.env.PORT || 3000;

// Get the directory name using the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// express.static.mime.define({'text/css': ['css']});
// express.static.mime.define({'application/javascript': ['js']});
// express.static.mime.define({'application/json': ['json']});
// express.static.mime.define({'image/png': ['png']});
// express.static.mime.define({'image/jpeg': ['jpg']});

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

// auth callback endpoint destination that causes a redirect to /
app.get("/oauth2callback", (req, res) => {
  res.sendFile("public/oauth2callback.html", { root: __dirname });
});

// add additional pages such as about, contact, etc.
app.get("/contact", (req, res) => {
  res.sendFile("public/contact.html", { root: __dirname });
});

// app.get('/blog', (req, res) => {
//     res.sendFile('public/blog.html', { root: __dirname });
// });

app.get("/buy", (req, res) => {
  res.sendFile("public/buy.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
