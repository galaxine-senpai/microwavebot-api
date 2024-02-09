function LoadLogger(type, name) {
  // Convert type to lowercase
  const typelc = type.toLowerCase();

  // Red green and reset console text
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const reset = "\x1b[0m";

  if (typelc === "middleware") {
    console.log(`${red}[MIDDLEWARE]${reset} ${name} loaded`);
  } else if (typelc === "router") {
    console.log(`${green}[ROUTER]${reset} /${name}/ loaded`);
  } else {
    console.log(`${red}[ERROR]${reset} Invalid type ${type}`);
  }
}

module.exports = { LoadLogger };
