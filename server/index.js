import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

// Configuring cors middleware
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creates an endpoint for the route `/`
app.get("/", (req, res) => {
    res.json("Hello Techtonica Server for a Game");
});

// Make the GET request for the GAME API
app.get('/api/game', async (req, res) => {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=boolean');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching trivia data:', error);
        res.status(500).json({ error: 'Failed to fetch trivia data' });
    }
});

app.listen(PORT, () => console.log(`Hola! Server running on Port http://localhost:${PORT}`));
