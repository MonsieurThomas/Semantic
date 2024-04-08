// const express = require("express");
// const app = express();
// const fs = require("fs");
// const pdf = require("pdf-parse");
// const cors = require("cors");

// app.use(cors()); // Permet les requêtes cross-origin
// app.get("/read-pdf", async (req, res) => {
//     try {
//     console.log(process.cwd())
//     let dataBuffer = fs.readFileSync("./Lorem_ipsum.pdf");
//     let data = await pdf(dataBuffer);
//     res.json({ text: data.text });
//     console.log("this is res = ", data.text)
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erreur lors de la lecture du PDF");
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });