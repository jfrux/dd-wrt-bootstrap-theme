dd-wrt-bootstrap-theme
======================

a fully responsive dd-wrt theme generated with grunt, less, etc.

Basically, the plan is... since it's so effing difficult to make dd-wrt themes since they have to be compiled in to the firmware...
I've decided to make a grunt-based theme repo that spits out a single application.js and application.css so all we have to do is add the link / script tag to the
firmware and we have a great theme.

My goal with this was to move dd-wrt admin panel to the modern web.
It will be fully responsnive for mobile devices and much friendlier for desktop browsers.

During development I'm using Firefox / Chrome plugin called "dotjs" to load the two scripts into my own router's markup on page load to see it in live action.
Ideally this process would be done by overriding the source code and compiling the two files into dd-wrt.

This application.js will override DOM / HTML elements if needed to make them tw-bootstrap3 friendly after the page renders.  With caching, this should be seamless to the user experience.
It acts as a "patcher" or "clean-up" script.

TODO:
- [ ] Build
  - [ ] Created a basic build that allows for CSS / JS to be added in to the theme.
- [ ] Design Changes
  - [ ] Place all design tasks here.
