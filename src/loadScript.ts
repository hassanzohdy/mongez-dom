export default function loadScript(src, onLoad) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onLoad;
  document.body.appendChild(script);

  return script;
}
