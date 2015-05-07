# svg-perf-test

Tests that try to answer the question -

> What type of Icon performs the best ?

> **Font Icons, SVGs inlined in a Web Page, or SVGs as Background Images in CSS**

Read more about the experiment on the [blog post](http://blog.nparashuram.com/2015/05/icons-font-inline-svg-or-background-svgs.html). 

## Running the tests

Requires Node 0.11 or greater and npm and Chrome 41+

1. Download [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) and start it using `./chromedriver`
2. Clone this repository and ensure that you checkout the this branch
3. Install all npm dependencies using `npm install`
4. Install sub modules using `git submodule init` and `git submodule update`
5. Start the test using `node lib/index.js`

Tests are run on Chrome on an Android device by default. Ensure that you have an android device connected, and have run `adb server start`. 
Change the [browser-perf options](https://github.com/axemclion/svg-perf-test/blob/09862d71da8ffb46783fa3805595ddea19acb6e5/lib/index.js#L58) to `chrome` to run on desktop Chrome.

## What happens in the test

1. First, three web pages are created for each of the 700+ icons in the ioniocs/src/ folder, one each for inline SVG, background SVG and Font Icon
2. A local Node Server is started
3. Each webpage is loaded on the browser (Android on Chrome by default)
4. Pages are scrolled, and tracing/timeline data is collected
5. [Browser-perf calculates](http://github.com/axemclion/browser-perf) metrics like frame rates, paints, etc and stores results in `data.json`.

## Helper Scripts
The repo also contains a `createMetadata.js` to create a `_meta.json` file that has a list of all icons, and metrics that need to show up when the `data.json` is converted to a csv file.
`dataToCSV.js` converts `data.json` to `_results.csv` to view and analyze the results. 
