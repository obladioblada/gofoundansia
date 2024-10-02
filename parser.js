const cheerio = require('cheerio');
// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const eventName = "stop-all-ansia-insieme"
let url = 'https://www.gofundme.com/f/' + eventName;

// Define a variable to change
let variable = "0";

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API to get the current value of the variable
app.get('/api/get-variable', async (req, res) => {

    // Repeat the task every 5 seconds (5000 milliseconds)
    let collectedMoney = await fetchElement();
    if (collectedMoney) res.json({ variable });
    return res.status(500);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const regex = /"unattributedDonationCounts":\{"__typename":"UnattributedDonationCounts","amountRaisedUnattributedNumber":(\d+),"numberOfDonationsUnattributed":(\d+)\}/;

const fetchElement = async () => {
    try {
        const response = await fetch(url);
        const data = await response.text();

        const $ = cheerio.load(data);
        var script = $('script')

        const match = script.text().match(regex);

        if (match) {
            console.log('Extracted amount:', match[1]);
            return match[1]
        } else {
            console.log('Pattern not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
