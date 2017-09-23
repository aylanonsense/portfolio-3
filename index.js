let express = require('express');
let app = express();
app.get('/', (req, res) => res.send('Under construction...'));
app.listen(process.env.PORT || 3000, () => console.log('Listening!'));