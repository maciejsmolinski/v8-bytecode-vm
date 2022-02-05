module.exports = function range(start, end) {
  if (start === end) {
    return [start, end];
  }

  const isGrowing = start < end;
  const [first, second] = isGrowing ? [start, end] : [end, start];
  const count = second - first + 1;

  const results = Array(count)
    .fill()
    .map((_, index) => first + index);

  return isGrowing ? results : results.reverse();
};
