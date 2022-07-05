## `Sosocio/eslint-config`

Reusable **eslint** settings for our projects.

## Install

In order to add eslint config, you'll need to add the following settings:

```
npm install @sosocio/eslint-config-frontend@1.0.4
```

Then create a **.eslintrc.js**:

```JS
module.exports = {
  extends: [
	"@sosocio/eslint-config-frontend", 
	]
};
```