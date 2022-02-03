/**
 * A naive implementation of Math.abs(x);
 */
function earlyReturn(a) {
  if (a < 0) {
    console.log('Less than zero');
    return a * -1;
  }

  console.log('Zero or more');
  return a;
}

earlyReturn(5);
