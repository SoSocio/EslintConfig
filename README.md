## `Sosocio/eslint-config`

Reusable **eslint** settings for our projects.

## Install

In order to add eslint config, you'll need to add the following settings:


For Frontend
````
npm install @sosocio/eslint-config-frontend@1.1.2
````

For Backend
````
npm install @sosocio/eslint-config-backend@1.1.2
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