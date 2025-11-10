# Flash Cards
This is a basic sveltekit staticly generated website that can be used to help
with memorization of simple math facts.

## Running
Navigate to [https://dmiller113.github.io/flashcards](https://dmiller113.github.io/flashcards)

## Development

### Installation
Install all dependancies, dev or otherwise, with `yarn`.

### Running the dev server
There's a dev script. Run:

```
$ yarn run dev
```

That will run the vite dev server. Add `--open` if you want a new tab opened
alongside.

### Building the site
There's a script.

```
$ yarn run build
```

Files will be output into `<root-directory>/build`. There is a simple static
file server built in `server.ts`. Run:

```
$ yarn tsx server.ts
```

to test serving the website.
