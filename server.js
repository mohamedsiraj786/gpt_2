const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let fetch;
// Use dynamic import
import('node-fetch').then(module => {
    fetch = module.default;
    startServer();
}).catch(err => {
    console.error('Failed to import node-fetch:', err);
});

function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(bodyParser.json());
    app.use(cors());

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/public/register.html');
    });

    app.post('/api/chatgpt', async (req, res) => {
        try {
            const chatGPTResponse = await fetch('https://chat.freedomgpt.com/api/liberty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            const data = await chatGPTResponse.json();
            res.json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
