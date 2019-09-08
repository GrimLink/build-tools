# Task runners en Bundlers

This repo contains sample setups for each Task runner en Bundler.

While the setup focuses an generic setup.
It does have some opinionated things I feel are the best way to go.

So if you have something that is wrong
or could have been done better.
Don't hesitate to shoot an PR/Issue with why and how.

<details><summary>Table of Contents</summary>

- [Whats in the 📦](#whats-in-the-%f0%9f%93%a6)
  - [Grunt](#grunt)
  - [Gulp](#gulp)
  - [Parcel](#parcel)
  - [Rollup](#rollup)
  - [Webpack](#webpack)

</details>

## Whats in the 📦

### [Grunt](./grunt/README.md)

Grunt setup with Webpack for JS bundeling.

I personlay moved to Gulp and/or Webpack.
So I am not using Grunt that much any more.

Still this setup rocks!
Since it builds the CSS just the way I want it.
And JS via the power of webpack.

I was planing to also add an Uglify option so you don't need the Webpack.
But I am not going to add this anymore.

### [Gulp](./gulp/README.md)

Pretty much an port of Grunt but with more flexibility.
Also I kept the tasks clean and simple.
Compared to many Gulp configs have seen that just lost logic 😨

I my current preferred build tool.

Just as Grunt it uses the power of Webpack for the JS.
But I am planning to add an uglify option.
Just because I want to see that option work as well.

### [Parcel](./parcel/README.md)

Sample setup using parcel.

Usefull for quick setups.
Since it is zero config.

Funny enough this not completely true.
There are many config for other packages found in a parcel project.
E.g. `postcss.config.js`, `.babelrc` and `.sassrc`.

But if you keep things simple you probably don't need this.

I personally do need these configs for my build tools.
So parcel is not my choice when to pick a build tool.

### [Rollup](./rollup/README.md)

_Sample not made yet_

### [Webpack](./webpack/README.md)

Like parcel webpack can also run without any config.

But I am planing to add an config example here.

For now you can check the version in the [Gulp sample](./gulp/webpack.config.js).
