var probable = require('probable');
var randomIA = require('random-internet-archive');
var sb = require('standard-bail')();
var tableDef = require('good-ia-source-image-probable-def');

var kitTable = probable.createTableFromSizes(tableDef);

function generateImageURL(done) {
  var kit = kitTable.roll();
  randomIA(
    {
      collection: kit.collection,
      query: kit.query,
      mediatype: 'image',
      fileExtensions: ['jpg', 'jpeg', 'png'],
      minimumSize: 100000,
      maximumSize: 5000000
    },
    sb(assembleImageURL, done)
  );

  function assembleImageURL({ url, collection, title, detailsURL }) {
    const numberOfRuns = probable.roll(10) === 0 ? probable.rollDie(4) : 1;
    const baseColorerURL =
      'http://jimkang.com/colorer-web/#displaySrcImage=no&hideUi=yes&srcImgUrl=' + url;
    var runs = [];

    for (var i = 0; i < numberOfRuns; ++i) {
      runs.push(generateRun(kit));
    }

    var collectionMention = '';
    if (collection) {
      collectionMention = 'from the ' + collection + ' collection ';
    }
    const text = `Recoloring of "${title}" ${collectionMention}in the Internet Archive`;
    const colorerURL =
      baseColorerURL + '&runs=' + encodeURIComponent(JSON.stringify(runs));
    const caption =
      text +
      ` | <a href="${detailsURL}">Original</a> | <a href="${colorerURL}">Colorer source</a>`;
    const noHTMLCaption =
      text + ` | Original: ${detailsURL} | Colorer source: ${colorerURL}`;

    done(null, {
      url: colorerURL,
      altText: text,
      caption,
      targetTexts: {
        mastodon: noHTMLCaption,
        twitter: noHTMLCaption
      }
    });
  }
}

function generateRun(kit) {
  return {
    renderer: 'replacer',
    quant: kit.quantMin + probable.roll(kit.quantMax - kit.quantMin),
    grayscale: kit.grayscale,
    recolorMode: 'random',
    showBase: probable.roll(100) < kit.showBaseChance ? 'yes' : 'no',
    opacityPercentOverBase:
      kit.overlayOpacityMin +
      probable.roll(kit.overlayOpacityMax - kit.overlayOpacityMin),
    minimumValueDifference: kit.minimumValueDifference || 0.2,
    numberOfRetriesToAvoidSingleColor:
      kit.numberOfRetriesToAvoidSingleColor || 5
  };
}

module.exports = {
  postingTargets: ['archive'],
  generateImageURL,
  shouldAutoCrop: true,
  webimageOpts: {
    viewportOpts: {
      width: 1280
    },
    screenshotOpts: {
      fullPage: true
    },
    autocrop: {
      cropOnlyFrames: false
    }
  },
  archive: {
    name: 'Colorer Bot',
    title: 'Colorer Bot',
    idPrefix: 'coloring-',
    homeLink: 'https://smidgeo.com/bots/colorer/',
    rootPath: '/usr/share/nginx/html/bots/colorer',
    footerHTML: `<footer>
    <p>By <a href="https://smidgeo.com/notes/deathmtn">Jim Kang</a> and adorsk</p>
    <p><a href="http://jimkang.com/colorer-web/">Do your own recoloring!</a></p>
    <p><a href="https://smidgeo.com/bots/colorer/rss/index.rss">Get recolorings in your RSS feed.</a></p>
    <p><a href="https://smidgeo.com/bots/">More bots!</a></p>
</footer>`,
    maxEntriesPerPage: 20,
    generateRSS: true,
    fileAbstractionType: 'LocalGit',
    archiveBaseURL: 'https://smidgeo.com/bots/colorer',
    rssFeedOpts: {
      feed_url: 'https://smidgeo.com/bots/colorer/rss/index.rss',
      site_url: 'https://smidgeo.com/bots/colorer/'
    }
  }
};
