function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	let strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

const listMessages = () => {
	const msgDiv = document.getElementById('messages');
	fetch('/posts').then((res) => res.json()).then((json) => {
		if (json.length === 0) {
			document.querySelector('.loader-container').style.display = 'none';
		} else {
			json.reverse();
			msgDiv.innerHTML = '';
			for (let i = 0; i < json.length; i++) {
				let date = json[i].date;
				let message = json[i].message;
				let name = json[i].name;

				const msgCard = document.createElement('div');
				msgCard.classList.add('messageCard');

				const nameI = document.createElement('h3');
				nameI.classList.add('name');
				nameI.textContent = name;

				const dateI = document.createElement('div');
				dateI.classList.add('date');
				dateI.textContent = date;

				const messageI = document.createElement('div');
				messageI.classList.add('message');
				messageI.textContent = message;

				msgCard.appendChild(nameI);
				msgCard.appendChild(dateI);
				msgCard.appendChild(messageI);

				msgDiv.appendChild(msgCard);
				document.querySelector('.loader-container').style.display = 'none';
			}
		}
	});
};

listMessages();

const button = document.getElementById('submitButton');
button.addEventListener('click', () => {
	const name = document.getElementById('name').value;
	const message = document.getElementById('message').value;
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	let yyyy = today.getFullYear();
	let err = [];

	document.querySelector('.loader-container').style.display = 'grid';

	if (name == '') {
		err.push('Please enter name');
	}
	if (message == '') {
		err.push('Please enter message');
	}

	if (err.length === 0) {
		today = dd + '-' + mm + '-' + yyyy + ' at ' + formatAMPM(new Date());
		let data = {
			name    : name,
			message : message,
			date    : today
		};
		fetch('/posts', {
			method  : 'post',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify(data)
		})
			.then((res) => {
				res.json();
			})
			.then((msgs) => {
				document.getElementById('myFrom').reset();
				listMessages();
			});
	} else {
		const error = document.querySelector('.error');
		err.forEach((err) => {
			error.innerHTML += err + '<br>';
			setTimeout(() => {
				error.innerHTML = '';
				err = [];
			}, 2000);
		});
	}
});
