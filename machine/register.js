export default function Register() {
  let value;

  return {
    get: () => value,
    set: (v) => (value = v),
  };
}
