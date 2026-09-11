# Iron Index — Health & Fitness Archive

A training archive of 1,324 movements. Pick a target muscle, get the exercises,
each with a still frame and an animated demonstration loop.

**Live:** [nextui-byy.pages.dev](https://nextui-byy.pages.dev/)

## Getting started

```bash
npm install
npm start
```

The app runs at http://localhost:3000. No API key is needed for the archive.

## Data and media

The catalogue ships with the app as `public/exercises.json` and is fetched once
at runtime. Images and animations are pulled from a version-pinned jsDelivr copy
of the upstream dataset, so nothing heavy lives in this repository.

Both come from
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset),
via the same approach [openGym](https://github.com/lebe24) uses. The media is not
covered by this project's license — check the upstream terms before
redistributing it.

To host the media yourself, clone the dataset and point the app at your copy:

```
REACT_APP_IMG_BASE=/media/img/
REACT_APP_GIF_BASE=/media/gif/
```

Source media is 180×180, so it upscales on large cards.

The body outlines in the muscle map (`src/lib/body-paths.js`) are derived from
[MuscleMap](https://github.com/melihcolpan/MuscleMap) by Melih Colpan, used under
the MIT License. They are loaded as a separate 40 kB chunk, so only visitors who
reach the map download them.

## Video search

The technique tab calls the YouTube Data API v3 (`youtube/v3/search`) directly.
Set `REACT_APP_YOUTUBE_API_KEY` in `.env.local`; it is the only key the app
needs. Each search costs 100 quota units against a 10,000/day default, so the
free tier allows roughly 100 searches a day. The key is inlined into the browser
bundle, so restrict it by HTTP referrer in the Google Cloud console.

> **Note:** the keys that used to be hard-coded in `src/services/` are in this
> repository's git history and no longer work. Treat them as compromised.

## Muscle map

Section 03 shades a front and back body by how much of the selected group trains
each muscle, and clicking a muscle (on the figure or in the list) narrows the
archive to it. A primary target counts 1 and a supporting muscle 0.4, so
"upper legs" spreads across quads, hamstrings and glutes rather than counting
three times. Shading is relative to the heaviest muscle in the current selection,
so the map reads as a balance rather than an absolute.

The dataset names muscles inconsistently: "delts", "deltoids" and "shoulders" are
one muscle, "lats" and "latissimus dorsi" another. `src/lib/muscles.js` collapses
every spelling onto the eighteen the map can draw, and drops what it cannot draw
(hands, ankles, "cardiovascular system") rather than guessing. That logic is
ported from openGym.

## Design

Brutalist sports-press: asphalt ground, bone type, one acid-lime signal colour,
hairline rules and condensed athletic display type. Big Shoulders Display for
headlines, Chivo for body copy, Chivo Mono for labels and data. Tokens live in
`src/styles/tokens.css`; every colour, rule and timing reads from there.

Exercise cards show the still frame by default and only request the animation
once you hover or press play, which keeps a page of twelve cards light.

## Structure

```
public/exercises.json     the movement catalogue
src/
  App.js                  state, data loading, layout composition
  styles/                 design tokens + base styles
  components/             one .jsx + .css pair per component
  lib/                    muscle resolution + body geometry
  services/               catalogue loader, YouTube search, quotes
```

`App.js` owns all state. Components are presentational and take props.

## Stack

React 18 · Create React App · plain CSS with custom properties. No UI framework.

---

Built by [lebe24](https://github.com/lebe24) · [lebe.pages.dev](https://lebe.pages.dev/)
