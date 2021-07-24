/* eslint-disable no-undef */
const Image = {};

function importAll (r) {
  r.keys().forEach(key => Image[key] = r(key));
}

importAll(require.context("../../assets/images", true, /\.(png|jpe?g|svg)$/));

export default Image;
