## `Sosocio/eslint-config`

Reusable **eslint** settings for our projects.

## Install

In order to add eslint config, you'll need to add the following settings:


<h2>For Frontend</h2>
````
npm install @sosocio/eslint-config-frontend@1.0.2
````

<h2>For Backend</h2>
````
npm install @sosocio/eslint-config-backend@1.0.1
````

Then create a **.eslintrc.js**:

```JS
module.exports = {
  extends: [
	"@sosocio/eslint-config-frontend", 
	"@sosocio/eslint-config-backend"
	]
};
```