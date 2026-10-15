export let urlPath = "";
export function initializeContext(pathname) {
  urlPath = pathname.replace("/", "");
}
