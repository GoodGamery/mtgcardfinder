const exec = require('child_process').exec;

const regexEscape = function(str) {
	const escapeRegex = /[|\\{}()[\]^$+*?.]/g;
	const subtitution = '\\$&';	
	return str.replace(escapeRegex, subtitution);
}

const getCardNameRegex = function(cardname) {
	return regexEscape(cardname).replace(/\s+/g, '\\s');
}

const multiverseUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';

const cardname = process.argv[2];

if (!cardname) {
	console.log('Card name argument not specified.');
	exit(1);
}

const searchUrl = `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+%5Bm/^${encodeURIComponent(getCardNameRegex(cardname))}$/%5D`;

const command = `curl -L ${searchUrl} `;

const cardImgRegex = /<div class="cardImage">\s+<img src="..\/..\/Handlers\/Image.ashx\?multiverseid=(\d+)/

exec(command, (error, stdout, sterr) => {
	if (error) {
		console.error('Error finding card: ' + error);
		return;
	}
	const match = stdout.match(cardImgRegex);
	if (match && match[1]) {
		console.log(multiverseUrl + match[1]);
	} else {
		console.log('no match found.');
	}
});