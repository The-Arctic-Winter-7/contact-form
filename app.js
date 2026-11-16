import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3002;
const contacts = [];
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(`home`);
});

app.get('/contact-form', (req, res) => {
    res.render(`contact-form`);
});

app.post('/submit-contact', async (req, res) => {
    try {
        const contact = req.body;
        console.log('New contact submitted: ', contact);
        const sql = 'INSERT INTO contacts (first_name, last_name, job_title, company_name, linkedin_url, email, first_meeting, other, email_format, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [
            contact.firstname,
            contact.lastname,
            contact.job,
            contact.company,
            contact.linkedin,
            contact.email,
            contact.meeting,
            contact.other,
            contact.format,
            contact.comments
        ];
        const [result] = await pool.execute(sql, params);
        console.log('Contact inserted with ID: ', result.insertId);
        res.render('confirm', { contact });
    } catch(err) {
         console.error('Error inserting order: ', err);
         if (err.code === 'ER_DUPE_ENTRY') {
            res.status(409).send('This contact already exists.');
         } else {
            res.status(500).send('Sorry, there was an error processing your contact information. Please try again.');
         }
    }
});

app.get('/admin', async (req, res) => {
    try {
        const [contacts] = await pool.query(`SELECT * FROM contacts ORDER BY timestamp DESC`);

        res.render('admin', { contacts });
    } catch (err) {
        console.error('Database Error: ', err);
        res.status(500).send('Error loading contacts: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});