var probable = require('probable');
var randomIA = require('random-internet-archive');
var sb = require('standard-bail')();

var kitTable = probable.createTableFromSizes([
  [
    10,
    // Unspecified
    {
      quantMin: 16,
      quantMax: 192,
      grayscale: 'yes',
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99
    }
  ],
  [
    100,
    // Animals
    {
      query: 'animals',
      quantMin: 16,
      quantMax: 160,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,

      grayscale: 'yes'
    }
  ],
  [
    150,
    // Nature
    {
      query: 'nature',
      quantMin: 16,
      quantMax: 128,
      showBaseChance: 30,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes',
      minimumValueDifference: 0.4
    }
  ],
  [
    200,
    // Sculpture
    {
      query: 'sculpture',
      quantMin: 16,
      quantMax: 192,
      showBaseChance: 30,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    100,
    // Landscape
    {
      query: 'landscape',
      quantMin: 16,
      quantMax: 192,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes',
      minimumValueDifference: 0.4
    }
  ],
  [
    150,
    // Portrait
    {
      query: 'portrait',
      quantMin: 16,
      quantMax: 192,
      showBaseChance: 80,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    100,
    // Metropolitan Museum of Art
    {
      collection: 'metropolitanmuseumofart-gallery',
      quantMin: 32,
      quantMax: 192,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    200,
    // Unsplash
    {
      collection: 'unsplash',
      quantMin: 32,
      quantMax: 192,
      showBaseChance: 40,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    70,
    // Name
    {
      collection: 'nasanaturalhazards',
      quantMin: 32,
      quantMax: 128,
      showBaseChance: 30,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    200,
    // Name
    {
      collection: 'visibleearthcollection',
      quantMin: 32,
      quantMax: 128,
      showBaseChance: 66,
      overlayOpacityMin: 20,
      overlayOpacityMax: 99,
      grayscale: 'yes',
      minimumValueDifference: 0.4
    }
  ],
  [
    50,
    // Name
    {
      collection: 'nasaimageofthedaygallery',
      quantMin: 32,
      quantMax: 144,
      showBaseChance: 30,
      overlayOpacityMin: 40,
      overlayOpacityMax: 99,
      grayscale: 'yes',
      minimumValueDifference: 0.4,
      numberOfRetriesToAvoidSingleColor: 8
    }
  ],
  [
    100,
    // Name
    {
      collection: 'flickrcommons',
      quantMin: 32,
      quantMax: 192,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ],
  [
    200,
    // Name
    {
      collection: 'afghanmediaresourcecenter',
      quantMin: 16,
      quantMax: 160,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes',
      minimumValueDifference: 0.4
    }
  ],
  [
    100,
    // Drawings
    {
      query: 'drawing',
      quantMin: 8,
      quantMax: 192,
      showBaseChance: 25,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'no'
    }
  ],
  [
    200,
    // Etchings
    {
      query: 'etching',
      quantMin: 8,
      quantMax: 192,
      showBaseChance: 25,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'no',
      numberOfRetriesToAvoidSingleColor: 8
    }
  ],
  [
    100,
    // Cat
    {
      query: 'cat',
      quantMin: 8,
      quantMax: 192,
      showBaseChance: 50,
      overlayOpacityMin: 30,
      overlayOpacityMax: 99,
      grayscale: 'yes'
    }
  ]
]);

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
      'http://jimkang.com/colorer-web/#displaySrcImage=no&srcImgUrl=' + url;
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

    done(null, {
      url: colorerURL,
      altText: text,
      caption:
        text +
        ` | <a href="${detailsURL}">Original</a> | <a href="${colorerURL}">Colorer source</a>`
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
  //postingTargets: ['archive', 'mastodon', 'twitter'],
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
