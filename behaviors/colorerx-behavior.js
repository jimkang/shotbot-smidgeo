var probable = require('probable');
var randomIA = require('random-internet-archive');
var sb = require('standard-bail')();

var kits = [
  {
    quantMin: 16,
    quantMax: 192,
    grayscale: 'yes',
    showBaseChance: 50
  },
  {
    query: 'animals',
    quantMin: 16,
    quantMax: 160,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    query: 'nature',
    quantMin: 16,
    quantMax: 128,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    query: 'sculpture',
    quantMin: 16,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    query: 'landscape',
    quantMin: 16,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    query: 'portrait',
    quantMin: 16,
    quantMax: 192,
    showBaseChance: 80,
    grayscale: 'yes'
  },
  {
    collection: 'metropolitanmuseumofart-gallery',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'unsplash',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'nasanaturalhazards',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'visibleearthcollection',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'nasaimageofthedaygallery',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'flickrcommons',
    quantMin: 32,
    quantMax: 192,
    showBaseChance: 50,
    grayscale: 'yes'
  },
  {
    collection: 'afghanmediaresourcecenter',
    quantMin: 16,
    quantMax: 160,
    showBaseChance: 50,
    grayscale: 'yes'
  },
];

function generateImageURL(done) {
  var kit = probable.pickFromArray(kits);
  randomIA(
    {
      // TODO: Set up specific probabilities for collections.
      // collection: probable.pickFromArray(['mathematicsimage', 'brooklynmuseum', 'coverartarchive', 'flickrcommons', 'flickr-ows', 'nasa', 'solarsystemcollection']),
      collection: kit.collection,
      query: kit.query,
      mediatype: 'image',
      fileExtensions: ['jpg', 'jpeg', 'png'],
      minimumSize: 50000,
      maximumSize: 3000000
    },
    sb(assembleImageURL, done)
  );

  function assembleImageURL({ url, collection, title, sourceURL }) {
    const numberOfRuns = probable.roll(4) === 0 ? probable.rollDie(4) : 1;
    const baseColorerURL =
      'http://jimkang.com/colorer-web/#displaySrcImage=no&srcImgUrl=' + url;
    var runs = [];

    for (var i = 0; i < numberOfRuns; ++i) {
      runs.push(generateRun(kit));
    }

    const text = `Recoloring of "${title}" from the ${collection} in the Internet Archive`;
    const colorerURL =
      baseColorerURL + '&runs=' + encodeURIComponent(JSON.stringify(runs));
    console.log('colorerURL:', colorerURL);

    done(null, {
      url: colorerURL,
      altText: text,
      caption: text + ` <a href="${sourceURL}">Source</a>, <a href="${colorerURL}">Colorer</a>`
    });
  }
}

function generateRun(kit) {
  return {
    renderer: 'replacer',
    //quant: probable.roll(3) == 0 ? probable.rollDie(200) : probable.pickFromArray([16, 32, 64, 64, 64, 96, 96, 128, 128, 128]),
    quant: kit.quantMin + probable.roll(kit.quantMax - kit.quantMin),
    grayscale: kit.grayscale,
    recolorMode: 'random',
    showBase: probable.roll(100) < kit.showBaseChance ? 'yes' : 'no',
    opacityPercentOverBase: probable.rollDie(70) + 30,
    minimumValueDifference: 0.2
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
    title: 'Colorer Bot (experimental)',
    idPrefix: 'coloring-',
    homeLink: 'https://smidgeo.com/bots/colorerx/',
    rootPath: '/usr/share/nginx/html/bots/colorerx',
    footerHTML: `<footer>
    <p>By <a href="https://smidgeo.com/notes/deathmtn">Jim Kang</a> and Alex Dorsk</p>
    <p><a href="http://jimkang.com/colorer-web/">Do your own recoloring!</a></p>
    <p><a href="https://smidgeo.com/bots/colorerx/rss/index.rss">Subscribe to RSS.</a></p>
</footer>`,
    maxEntriesPerPage: 20,
    generateRSS: true,
    fileAbstractionType: 'LocalGit',
    archiveBaseURL: 'https://smidgeo.com/bots/colorerx',
    rssFeedOpts: {
      feed_url: 'https://smidgeo.com/bots/colorerx/rss/index.rss',
      site_url: 'https://smidgeo.com/bots/colorerx/'
    }
  }
};
