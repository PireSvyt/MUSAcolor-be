module.exports = {
  random_id: random_id,
  random_string: random_string,
};

function random_id(length = 12) {
  return (temp_id = Math.random()
    .toString(2 * length)
    .substr(2, length));
}
function random_string(length = 24) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
