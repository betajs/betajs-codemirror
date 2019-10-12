# betajs-codemirror 1.0.7
[![Code Climate](https://codeclimate.com/github/betajs/betajs-codemirror/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-codemirror)
[![NPM](https://img.shields.io/npm/v/betajs-codemirror.svg?style=flat)](https://www.npmjs.com/package/betajs-codemirror)
[![Gitter Chat](https://badges.gitter.im/betajs/betajs-codemirror.svg)](https://gitter.im/betajs/betajs-codemirror)

BetaJS-Codemirror is a Codemirror Plugin for the BetaJS Framework.



## Getting Started


You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="codemirror/codemirror.js"></script>
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-browser/dist/betajs-browser.min.js"></script>
	<script src="betajs-dynamics/dist/betajs-dynamics.min.js"></script>
	<script src="betajs-codemirror/dist/betajs-codemirror.min.js"></script>
``` 

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-codemirror.git
	npm install
	grunt
```



## Basic Usage


```html

		<ba-codemirror ba-trim ba-language='html'>
			<div>
				<h1>H1 None</h1>
				<br />
				<strong>Strong 1</strong> Text 1 <code>Code 1</code><br />
				<code style="text-decoration: underline" >Code 2</code><strong> Strong 2</strong>
				<div style="font-size: 24px; font-family: Helvetica;">Text 2</div>
			</div>
		</ba-codemirror>

```

```javascript

	BetaJS.Dynamics.Dynamic.activate();

```



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [https://betajs.com](https://betajs.com) |
| Git        | [git://github.com/betajs/betajs-codemirror.git](git://github.com/betajs/betajs-codemirror.git) |
| Repository | [https://github.com/betajs/betajs-codemirror](https://github.com/betajs/betajs-codemirror) |
| Blog       | [https://blog.betajs.com](https://blog.betajs.com) | 
| Twitter    | [https://twitter.com/thebetajs](https://twitter.com/thebetajs) | 
| Gitter     | [https://gitter.im/betajs/betajs-codemirror](https://gitter.im/betajs/betajs-codemirror) | 




## CDN
| Resource | URL |
| :----- | -------: |
| betajs-codemirror.js | [http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror.js](http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror.js) |
| betajs-codemirror.min.js | [http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror.min.js](http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror.min.js) |
| betajs-codemirror-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror-noscoped.js](http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror-noscoped.js) |
| betajs-codemirror-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-codemirror/master/dist/betajs-codemirror-noscoped.min.js) |



## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-browser | [Open](https://github.com/betajs/betajs-browser) |
| betajs-dynamics | [Open](https://github.com/betajs/betajs-dynamics) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Main Contributors

- Victor Lingenthal
- Oliver Friedmann
- Ibnu Triyono

## License

Apache-2.0







