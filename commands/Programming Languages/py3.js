const terminal = require('child_process').execSync;
const searchFlags = require('/app/utils/searchFlags');
const MessageAttachment = require('/app/utils/MessageAttachment');

module.exports = {
  name: ['Py3', 'Python3'],
  usage: '<Code>',
  desc: 'Executes Python 3 code. Use --hide for hide the output and --del for delete the invocation message',
  DM: true,
  permissions: [ 'DEV' ],
  async exec(UnivBot, msg) {
    let obj = searchFlags(msg.args.trim(), ['--hide', '--del' ])
    
    let hide = false;
    let del = false;
    
    if (obj.flags.includes('--hide'))
        hide = true;
    if (obj.flags.includes('--del'))
        del = true;
    
    if (!obj.string.length)
      return msg.send('**Oops!** You didn\'t provided enough arguments');
    
    let output;
    try {
      output = terminal('echo "' + obj.string.replace(/"/g, '\\"').replace(/`/g, '\\`') + '" | python3', {shell: '/bin/bash'}).toString();
    } catch(e) {
      if (!hide)
        return msg.send(e.toString(), {code: 'js'});
      return;
    }
    
    if (del && msg.guild) {
      msg.delete();
    };
    if (hide) {
      return;
    };
    
    if (output.length == 0)
      output = 'Successfully executed script without errors. Exit with code 0';
    
    let config = new MessageAttachment(output, 'output.txt');
    config.code = 'py';
    
    if (output.length >= 1024) {
      await msg.send('The output has been trimmed to the first 1024 characters.');
      msg.send(output.substr(0, 1024), config);
    } else {
      msg.send(output, config);
    };
    
  }
};

