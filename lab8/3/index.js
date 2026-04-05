const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const conn = require('./database');

app.use(express.static('public'));

app.set('view engine', 'ejs');

const createTable = `
CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song VARCHAR(255),
    artist VARCHAR(255),
    album VARCHAR(255),
    year INT,
    genre VARCHAR(100),
    album_cover TEXT
)
`;

conn.query(createTable, (err) => {
    if (err) throw err;
    console.log("Table ready!");

    conn.query("SELECT COUNT(*) as count FROM albums", (err, result) => {
        if (err) throw err;

        if (result[0].count === 0) {

            const csvPath = path.join(__dirname, 'albums.csv');

            fs.readFile(csvPath, 'utf8', (err, data) => {
                if (err) {
                    console.error("ไม่เจอไฟล์ albums.csv ใน Folder Project");
                    return;
                }

                const lines = data.split('\n');
                const insertData = [];

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line) {
                        const cols = line.split(',');

                        if (cols.length >= 6) {
                            insertData.push([
                                cols[0].trim(), // song
                                cols[1].trim(), // artist
                                cols[2].trim(), // album
                                cols[3].trim(), // year
                                cols[4].trim(), // genre
                                cols[5].trim()  // album_cover
                            ]);
                        }
                    }
                }

                if (insertData.length > 0) {
                    const sql = "INSERT INTO albums (song, artist, album, year, genre, album_cover) VALUES ?";
                    conn.query(sql, [insertData], (err) => {
                        if (err) throw err;
                        console.log("CSV Imported Successfully via INSERT!");
                    });
                }
            });
        }
    });
});

app.get('/', (req, res) => {
    conn.query("SELECT * FROM albums", (err, result) => {
        if (err) throw err;
        res.render('show', { data: result });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});