import express from 'express';

const app = express();
const PORT = 3002;
const contacts = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(`home`);
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});