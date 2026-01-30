const express = require("express");
const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
