const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

function imageLink(asset: string, size: number) {
  return `https://images.yet-another-react-lightbox.com/${asset}.${size}w.jpg`;
}
