# True Stories

True Stories is a project made for [GovHack](http://govhack.org) Australia 2015 by team [Potato Heads](#team-potato-heads).

The primary goal of True Stories is to promote viewership of the 8500 photo stories in the [ABC Local Stories archive](https://data.gov.au/data/dataset/3fd356c6-0ad4-453e-82e9-03af582024c3). We create a [Google Chrome Extension] which shows you a different story every time you open a new tab. We believe that this is a fun, friendly and non-intrusive way to add a bit of ABC local to your life.

It doesn't get in your way, and if you see something interesting, there are links to dive deeper into the archive and find out more about the story that you're looking at!

We've enriched the data with [ABS data](https://www.abs.gov.au/ausstats/abs@.nsf/Lookup/2071.0main+features1132016) on the local area and shown it on a map on our website as well, allowing you explore Australia.

See more info on our [website](https://localstories.com.au). Or just go ahead and download the [Google Chrome Extension]!

# To do
- Add a random story to the home page
- Add map and local info to the chrome extension
- Add history to the extension, so that you can see recent stories
- Add a to-do list / notes or Trello integration to the extension
- Allow other datasets to be included
- Clean up twitter data
- Add tests

# Version
1.0.0

# Tech
True Stories is built using [Thalia], A NodeJS MVC framework, using Sequelize ORM, Mustache templates, Typescript and SASS compilation.

# Team Potato Heads
(No particular order - we all worked hard on this)
* [@Certifiedwaif] - Mark Greenaway - Data Scientist
* [@Zazuazad] - Zaara Azad - Data Scientist
* [@Frostickle] - David Ma - Developer
* [@Aeromental] - Daniel Sempértegui - Designer
* [@StringStory] - Suzie Nguyen - Storyteller

### Installation

Just download it from the [Chrome Web Store]!

To serve the website:
* Clone this repository
* yarn install
* yarn start

Note that it will serve on port 1337 by default. Use "yarn start 80" to serve on port 80.

To develop the website, use [Thalia] and clone this repository into the /websites/ folder.

# Folder Structure:

* data: Data and scripts used by the system
* ext: The Google Chrome Extension folder. This is 99% boilerplate. The only files of interest are in: ext/src/override, these files describe the webpage that override the new tabs.
* public: static pages
* src: SASS and Typescript to be compiled to CSS and Javascript, in dist
* views: Mustache template files. Html with some data insertion, use Thalia to serve these.
* server: Contains thalia.js


License
----

MIT

[@Aeromental]: http://twitter.com/aeromental
[@StringStory]: http://twitter.com/stringstory
[@Zazuazad]: http://twitter.com/zazuazad
[@Certifiedwaif]: http://twitter.com/certifiedwaif
[@Frostickle]: http://twitter.com/frostickle
[Chrome Web Store]: https://chrome.google.com/webstore/detail/true-stories/cemjfombkpblppjbaepfldgmnhfjpmjh
[Google Chrome Extension]: https://chrome.google.com/webstore/detail/true-stories/cemjfombkpblppjbaepfldgmnhfjpmjh
[ABC Local Stories archive]: https://data.gov.au/dataset/abc-local-online-photo-stories-2009-2014
[hackerspace]: http://hackerspace.govhack.org/content/true-stories
[node.js]:http://nodejs.org
[jQuery]:http://jquery.com
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[d3.js]: https://d3js.org/
[Thalia]: https://github.com/david-ma/Thalia