const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'audio');
const files = fs.readdirSync(audioDir);
const playlist = [];

// Known metadata for existing files
const knownData = {
  "如愿.m4a": { title: "如愿", contributor: "(你猜)", size: 105 },
  "枫.m4a": { title: "枫", contributor: "老王", size: 110 },
  "告白气球.m4a": { title: "告白气球", contributor: "唔机", size: 95 },
  "情歌.m4a": { title: "情歌", contributor: "老王", size: 85 },
  "巴赫旧约.m4a": { title: "巴赫旧约", contributor: "老王", size: 100 },
  "寂寞的季节.m4a": { title: "寂寞的季节", contributor: "小声的老王", size: 90 },
  "群歌!.m4a": { title: "群歌!", contributor: "(你猜)", size: 95 },
  "便利贴!_!.m4a": { title: "便利贴", contributor: "(你猜)", size: 95 },
  // fallback for actual filenames
  "如愿^ - ^.m4a": { title: "如愿", contributor: "(你猜)", size: 105 }
};

files.forEach(file => {
  if (file.endsWith('.m4a') || file.endsWith('.mp3') || file.endsWith('.wav')) {
    if (knownData[file]) {
      playlist.push({
        title: knownData[file].title,
        src: "./audio/" + file,
        size: knownData[file].size,
        contributor: knownData[file].contributor
      });
    } else {
      // New uploaded file logic
      // Assume format: "SongName_Contributor.m4a" or just "SongName.m4a"
      let baseName = file.replace(/\.[^/.]+$/, "");
      let title = baseName;
      let contributor = "神秘人";
      
      if (baseName.includes('_')) {
        const parts = baseName.split('_');
        title = parts[0];
        contributor = parts.slice(1).join('_');
      } else if (baseName.includes('-')) {
        const parts = baseName.split('-');
        title = parts[0];
        contributor = parts.slice(1).join('-');
      }

      playlist.push({
        title: title,
        src: "./audio/" + file,
        size: 80 + Math.random() * 40, // random size for new bubbles
        contributor: contributor
      });
    }
  }
});

fs.writeFileSync(path.join(__dirname, 'playlist.json'), JSON.stringify(playlist, null, 2));
console.log('playlist.json generated with ' + playlist.length + ' tracks!');
