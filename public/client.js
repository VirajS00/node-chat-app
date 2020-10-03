const listMessages = () => {
	const msgDiv = document.getElementById('messages');
	fetch('/posts').then((res) => res.json()).then((json) => {
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

	if (name == '') {
		err.push('Please enter name');
	}
	if (message == '') {
		err.push('Please enter message');
	}

	if (err.length === 0) {
		today = dd + '-' + mm + '-' + yyyy;
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
