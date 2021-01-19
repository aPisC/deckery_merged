export default function combineRefs(...refs) {
  return function (val) {
    refs.forEach((ref) =>
      typeof ref === 'function' ? ref(val) : ref && (ref.current = val)
    );
  };
}
