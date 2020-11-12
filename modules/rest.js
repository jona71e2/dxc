import * as config from "/modules/config.js";
import * as local from "/modules/local-storage.js";
// import * as brochure from "/modules/brochure.js";

export { post };

// function get() {
//   fetch(config.endpoint, {
//     method: "get",
//     headers: {
//       "Content-type": "application/json; charset=utf-8",
//       "x-apikey": config.key,
//       "cache-control": "no-cache",
//     },
//   })
//     .then((e) => e.json())
//     .then((data) => {
//       brochure.getData(data);
//     });
// }

// function put(id, data) {
//   const postData = JSON.stringify(data);

//   fetch(`${config.endpoint}/${id}`, {
//     method: "put",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "x-apikey": config.key,
//       "cache-control": "no-cache",
//     },
//     body: postData,
//   })
//     .then((d) => d.json())
//     .then((data) => {
//       //   console.log(data);
//     });
// }

function post(data) {
  const postData = JSON.stringify(data);
  fetch(config.endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": config.key,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then(local.storeFormStatus);
}
