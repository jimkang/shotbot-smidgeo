var callNextTick = require('call-next-tick');

function generateImageURL(done) {
  const seed = new Date().toISOString();
  const url = 'https://jimkang.com/slopcube/#hideUI=yes&seed=' + seed;
  const appURL = 'https://jimkang.com/slopcube/#seed=' + seed;
  const caption = `<a href="${appURL}">High-def interactive version</a>`;

  callNextTick(done, null, {
    url,
    altText: 'Slop Cube',
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
    idPrefix: 'slopcube-',
    homeLink: 'https://smidgeo.com/bots/slopcube/',
    rootPath: '/usr/share/nginx/html/bots/slopcube',
    footerHTML: `<footer>
    <p><a href="http://jimkang.com/slopcube/">Visit Slop Cube</a></p>
    <p><a href="https://smidgeo.com/bots/slopcube/rss/index.rss">RSS Slop Cube</a></p>
    <p><a href="https://smidgeo.com/bots/">More bots</a></p>
</footer>`,
    maxEntriesPerPage: 20,
    generateRSS: true,
    fileAbstractionType: 'LocalGit',
    archiveBaseURL: 'https://smidgeo.com/bots/slopcube',
    rssFeedOpts: {
      feed_url: 'https://smidgeo.com/bots/slopcube/rss/index.rss',
      site_url: 'https://smidgeo.com/bots/slopcube/'
    }
  }
};
