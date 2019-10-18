const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");

const urls = Array(38)
  .fill(null)
  .map((u, i) => {
    if (i < 10) {
      i = `0${i}`;
    }
    return {
      url: `http://baroque.me/audio/harp_${i}.mp3`,
      filename: `harp_${i}.mp3`
    };
  });

const downloadImage = i => {
  const path = Path.resolve(__dirname, "images", i.filename);
  const writer = Fs.createWriteStream(path);

  Axios({
    url: i.url,
    method: "GET",
    responseType: "stream"
  }).then(response => {
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  });
};

urls.forEach(url => {
  downloadImage(url);
});
