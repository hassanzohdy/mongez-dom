export default function pressed(e, key) {
  return (e.keyCode || e.charCode) === key;
}
