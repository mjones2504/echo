const { spawnSync }     = require('child_process');
const MessageAttachment = require('../../utils/MessageAttachment');
const fs                = require('fs');

module.exports = {
	name: [ 'qr', 'qrencode' ],
	usage: '<text>',
	desc: 'Generates a QR code of the provided text',
	DM: true,
	permissions: [],
	exec(UnivBot, msg) {
		if(msg.attachments.first())
			msg.args.value = msg.attachments.first().attachment;

		if(!msg.args.value)
			return msg.send('Enter some text!');

		spawnSync('qrencode', ['-o', 'qr.png'].concat(msg.args.value), { encoding: 'utf-8' });
		if(fs.existsSync('qr.png')) {
			qr = fs.readFileSync('qr.png');
			fs.unlinkSync('qr.png');
		}

		msg.send('', MessageAttachment(qr, 'qr.png'))
	}
}
