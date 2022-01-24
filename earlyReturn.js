function main(a) {
  if (a < 0) {
    console.log("Less than zero");
    return Math.abs(a);
  }

  console.log("Zero or more");
  return a;
}

main(5);
