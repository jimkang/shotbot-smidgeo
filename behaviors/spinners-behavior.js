var callNextTick = require('call-next-tick');

function generateImageURL(done) {
  const seed = new Date().toISOString();
  const url = 'https://jimkang.com/spinners/#hideUI=yes&seed=' + seed;
  const appURL = 'https://jimkang.com/spinners/#seed=' + seed;
  const caption = `<a href="${appURL}">High-def interactive version</a>`;

  callNextTick(done, null, {
    url,
    altText: 'Spinners!',
    caption
  });
}

module.exports = {
  postingTargets: ['archive'],
  generateImageURL,
  shouldAutoCrop: false,
  webimageOpts: {
    viewportOpts: {
      width: 500,
      height: 500
    },
    screenshotOpts: {
      fullPage: true
    },
    burstCount: 48,
    timeBetweenBursts: 1000 / 12,
    makeBurstsIntoAnimatedGif: true
  },
  archive: {
    name: 'Spinners',
    title: 'Spinners',
    idPrefix: 'spinners-',
    homeLink: 'https://smidgeo.com/bots/spinners/',
    rootPath: '/usr/share/nginx/html/bots/spinners',
    footerHTML: `<footer>
    <p><a href="http://jimkang.com/spinners/">Check out new spinners any time you want!</a></p>
    <p><a href="https://smidgeo.com/bots/spinners/rss/index.rss">Spin up your RSS feed.</a></p>
    <p><a href="https://smidgeo.com/bots/">More bots!</a></p>
</footer>`,
    maxEntriesPerPage: 20,
    generateRSS: true,
    fileAbstractionType: 'LocalGit',
    archiveBaseURL: 'https://smidgeo.com/bots/spinners',
    rssFeedOpts: {
      feed_url: 'https://smidgeo.com/bots/spinners/rss/index.rss',
      site_url: 'https://smidgeo.com/bots/spinners/'
    }
  }
};
