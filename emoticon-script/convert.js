const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.resolve(__dirname, 'input/input.txt'), 'utf8');
const leftEmoticonTemplate = fs.readFileSync(path.resolve(__dirname, 'emoticon-left.mustache'), 'utf8');
const rightEmoticonTemplate = fs.readFileSync(path.resolve(__dirname, 'emoticon-right.mustache'), 'utf8');
const storyMustache = fs.readFileSync(path.resolve(__dirname, 'story.mustache'), 'utf8');
const lines = input.split('\n');
const Mustache = require('mustache');

let name, expression, dialog, view;
let firstCharacter = null;

let parsedLines = [];

lines.forEach((line) => {
  // No blank lines.
  if (line.length === 0) {
    return;
  }

  // Split character from dialog.
  line = line.split(' - ');
  dialog = line[1];
  // Split name from expression.
  name = line[0].split(' ')[0];
  expression = line[0].split(' ')[1].slice(1, -1).toLowerCase();
  // Generate Mustache Template
  view = {
    character_name: name,
    character_name_class: name.toLowerCase(),
    character_dialog: dialog,
    character_expression: `${name.toLowerCase()}_${expression}`,
  }
  parsedLines.push(
    Mustache.render(
      determineDirection(name) === 'left' ? leftEmoticonTemplate : rightEmoticonTemplate, view
    )
  );
});

fs.writeFileSync(path.resolve(__dirname, './output/output.html'), Mustache.render(storyMustache, {dialog: parsedLines.join('\n')}), 'utf8');

function determineDirection(name) {
  if(firstCharacter === null) {
    firstCharacter = name;
    return 'left';
  }
  else if(firstCharacter === name) {
    return 'left';
  }
  return 'right';
}
