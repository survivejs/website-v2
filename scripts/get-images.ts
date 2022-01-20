import config from "../.config.json" assert { type: "json" };

const images = Object.fromEntries((await fetch(config.getImagesEndpoint, {
  headers: {
    Authorization: `Bearer ${config.getImagesToken}`,
  },
}).then((res) => res.json()).catch((err) => console.error(err)) as {
  filename: string;
  id: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
}[]).map(({ filename, id }) => [filename, id]));

console.log(JSON.stringify(images, null, 2));
