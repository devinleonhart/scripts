const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.resolve(__dirname, 'input/input.txt'), 'utf8');
const emoteTemplate = fs.readFileSync(path.resolve(__dirname, 'emote.mustache'), 'utf8');
const lines = input.split('\n');
const Mustache = require('mustache');

let name, expression, dialog, view;

let lastSpeaker = null;

const parsedLines = lines.filter(line => line.length > 0).map((line) => {
  // Split character from dialog.
  line = line.split(' - ');
  dialog = line[1];

  // Split name from expression.
  name = line[0].split(' ')[0];
  expression = line[0].split(' ')[1].slice(1, -1).toLowerCase();

  // Generate Mustache Template
  view = {
    character: name.toLowerCase(),
    emotion: expression,
    side: determineDirection(name),
    dialog: dialog,
    name: name
  }

  return Mustache.render(
    emoteTemplate, view
  );
});

fs.writeFileSync(path.resolve(__dirname, './output/output.html'), parsedLines.join('\n'), 'utf8');

function determineDirection(name) {
  if (lastSpeaker === null) {
    lastSpeaker = {direction: 'left', name: name};
    return 'left';
  }
  else if(lastSpeaker.name === name) {
    return lastSpeaker.direction;
  }
  else {
    lastSpeaker.name = name;
    lastSpeaker.direction = lastSpeaker.direction === 'left' ? 'right' : 'left'
    return lastSpeaker.direction;
  }
}
