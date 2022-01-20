# SurviveJS - Website v2

This is the source of [https://survivejs.com/](https://survivejs.com/).

## Development

Make sure you have [Deno](https://deno.land) and [Velociraptor](https://velociraptor.run/) installed before proceeding.

First, clone this repository:

```bash
git clone https://github.com/survivejs/website-v2
```

Then, setup a `.config.json` file as follows:

```json
{
  "getImagesEndpoint": "TODO",
  "getImagesToken": "TODO",
  "imagesEndpoint": "TODO"
}
```

Then, bootstrap the project:

```bash
vr bootstrap
```

Finally, start the development server:

```bash
vr start
```

Now you can go to [http://localhost:3000](http://localhost:3000) to see the site.

## Deployment

To generate the build, run:

```bash
vr build
```

## Known caveats

* It seems Cloudflare Images doesn't support hosting SVGs yet so they'll have to be served through this repository. They are stored in `assets/img` and then the reference is `/assets/img/<name>.svg`.
