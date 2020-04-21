/*
  Load these in for new users
*/

export default [
  {
    title: "Welcome",
    tags: ["meta", "ofnote"],
    modified: 1572914983219,
    slug: "welcome",
    md: `
[![build](https://github.com/jhackshaw/ofnotes/workflows/ofnotes/badge.svg)](https://github.com/jhackshaw/ofnotes/actions)
[![codecov](https://codecov.io/gh/jhackshaw/ofnotes/branch/master/graph/badge.svg)](https://codecov.io/gh/jhackshaw/ofnotes)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://www.ofnote.site)
![GitHub](https://img.shields.io/github/license/jhackshaw/ofnotes)

### About

Ofnotes is a note taking application that is completely offline with support for live editing markdown and material-design. All notes are stored locally per browser.

### Features

- **Markdown**: notes support [github flavored markdown](https://github.github.com/gfm/) and are rendered using material design
- **Tags**: notes can be tagged to make categorizing and finding them quick and easy
- **Indexeddb**: never run out of storage space for notes
- **Dark mode**: essential

#### Built with

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [ReactJS](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [Dexie](https://dexie.org/)
- [React Router](https://reacttraining.com/react-router/)
- [MomentJS](https://momentjs.com/)

#### Continuous Integration

GitHub Actions is used for CI/CD by synchronizing with an AWS s3 static site enabled bucket. CI configuration can be viewed at [.github/workflows/ofnotes.yml](https://github.com/jhackshaw/ofnotes/blob/master/.github/workflows/ofnotes.yml). Every push to master triggers the following steps:

1. Install nodejs and dependencies (npm ci)
2. Ensure prettier code style (npm format:check)
3. Run tests (npm run test -- --coverage)
4. Upload test coverage to [codecov](https://codecov.io/gh/jhackshaw/ofnotes)
5. Build production application (npm run build)
6. Deploy application to s3 bucket

#### development

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://www.ofnote.site)

- Clone repo:  
  \`git clone https://github.com/jhackshaw/ofnotes\`
- Install dependencies:  
  \`npm install\`
- Run tests:  
  \`npm run test\`
- Run tests with code coverage:  
  \`npm run test -- --coverage\`
- Run development server:  
  \`npm run start\`
- Format source:  
  \`npm run format\`.

Pull requests are always appreciated.
`,
  },
  {
    title: "GitHub Flavored Markdown",
    tags: ["meta", "ofnote"],
    modified: 1572914981220,
    slug: "markdown",
    md: `
  
### Preformatted block

\`\`\`
        _____              __                 
  _____/ ____\\____   _____/  |_  ____   ______
 /  _ \\   __\\/    \\ /  _ \\   __\\/ __ \\ /  ___/
(  <_> )  | |   |  (  <_> )  | \\  ___/ \\___ \\ 
 \\____/|__| |___|  /\\____/|__|  \\___  >____  >
                 \\/                 \\/     \\/ 
\`\`\`


### Block quotes

> This is a blockquote

### Tables

| Tables   |      Are      |  Cool |
|----------|---------------|-------|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |
  

### Code


    def robot_invasion
      puts("robot " * 1000)
    end

\`\`\`python
def rebot_invasion():
    print("robot" * 1000)
\`\`\`


# Heading 1
## Heading 2
### Heading 3
#### Heading 4


***

### Paragraph

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.


### Images

![No size](https://picsum.photos/150)

### lists

- unordered
  * Red Apples
  * Purple Grapes
  * Green Kiwifruits
- task list
  - [ ] Red Apples
  - [ ] Purple Grapes
  - [x] Green Kiwifruits
- ordered
  1. Red Apples
  2. Purple Grapes
  3. Green Kiwifruits



### Definition list

<dl>
  <dt>Lower cost</dt>
  <dd>The new version of this product costs significantly less than the previous one!</dd>
  <dt>Easier to use</dt>
  <dd>We've changed the product so that it's much easier to use!</dd>
</dl>

`,
  },
];
