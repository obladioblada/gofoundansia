const cheerio = require('cheerio');
// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const eventName = "stop-all-ansia-insieme"
let url = 'https://www.gofundme.com/f/' + eventName;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

var otherSourceMoney = 0

// API to get the current value of the variable
app.get('/api/get-variable', async (req, res) => {

    // Repeat the task every 5 seconds (5000 milliseconds)
    let variable = await fetchElement();
    if (variable ) {
        variable = Number(variable) + otherSourceMoney;
        res.json({ variable })
    };
    return res.status(500);
});


// API to update the variable
app.post('/api/add-variable/:newValue', (req, res) => {
    otherSourceMoney = otherSourceMoney + Number(req.params.newValue);
    console.log(`Got ${otherSourceMoney} from other source! great!`);
    res.json({ message: `Got ${otherSourceMoney} from other source! great!` });
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
