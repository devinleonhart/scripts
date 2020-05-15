const fs = require("fs");
const { Canvas, Image } = require("canvas");
const mergeImages = require("merge-images");
const kona = require("./characters/kona");
const jill = require("./characters/jill");
const maxine = require("./characters/maxine");
const miko = require("./characters/miko");
const sandy = require("./characters/sandy");
const steve = require("./characters/steve");

outputDirectory = "./output/";

// Make each emoji based on the filenames of the pieces.
Promise.all(
  [...kona.emotes, ...jill.emotes, ...maxine.emotes, ...miko.emotes, ...sandy.emotes, ...steve.emotes].map((emote) =>
    makeEmoji(emote)
  )
).then(
  (emotes) => {
    saveEmotes(emotes);
  },
  (err) => {
    console.error(err);
  }
);

// Collects the pieces and returns a promise that resolves to the b64 of the finished emote.
function makeEmoji({ key, character, head, eyebrow, eyes, mouth }) {
  const assets = {
    sandy: sandy.sources,
    kona: kona.sources,
    jill: jill.sources,
    maxine: maxine.sources,
    miko: miko.sources,
    steve: steve.sources,
  };
  return new Promise((resolve, reject) => {
    mergeImages(
      [
        assets[character].head[head],
        assets[character].eyebrow[eyebrow],
        assets[character].eyes[eyes],
        assets[character].mouth[mouth],
      ],
      {
        Canvas: Canvas,
        Image: Image,
      }
    ).then(
      (b64) => {
        resolve({
          key: key,
          image: b64.replace(/^data:image\/\w+;base64,/, ""),
        });
      },
      (err) => {
        reject(err);
      }
    );
  });
}

// Save all the emotes to file.
function saveEmotes(emotes) {
  emotes.forEach((emote) => {
    let buff = Buffer.from(emote.image, "base64");
    fs.writeFile(`${outputDirectory}${emote.key}.png`, buff, (err) => {
      if (err) throw err;
    });
  });
}
