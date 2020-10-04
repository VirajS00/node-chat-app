const express = require('express');
const monk = require('monk');
const Filter = require('bad-words');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.static('./public'));

const db = monk(process.env.MONGODB_URI || 'localhost/myDB');
const messages = db.get('messages');
const filter = new Filter();

app.use(express.json());

const isValid = (data) => {
	return data.name && data.name.toString().trim() !== '' && data.message && data.message.toString().trim() !== '';
};

app.post('/posts', (req, res) => {
	if (isValid(req.body)) {
		const data = {
			name    : filter.clean(req.body.name.toString()),
			message : filter.clean(req.body.message.toString()),
			date    : req.body.date.toString()
		};
		// console.log(data);
		messages.insert(data).then((insertedData) => {
			// console.log(insertedData);
			res.json(insertedData);
		});
	} else {
		res.status(422);
		res.json({
			status : 'please enter name and content!'
		});
	}
});

app.get('/posts', (req, res) => {
	messages.find().then((messages) => {
		res.json(messages);
	});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`listning on port ${port}`);
});
