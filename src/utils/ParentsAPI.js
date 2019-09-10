import request from "superagent/lib/client"

export default {
  getParents: url => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set("Accept", "application/json")
        .end((err, response) => {
          if (err) reject(err)
          resolve(JSON.parse(response.text))
        })
    })
  },
  addParent: (url, parent) => {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .set("Content-Type", "application/json")
        .send(parent)
        .accept("application/json")
        .end((err, response) => {
          if (err) reject(err)
          resolve(JSON.parse(response.text))
        })
    })
  },
  updateParent: (url, parent) => {
    return new Promise((resolve, reject) => {
      request
        .put(url)
        .set("Content-Type", "application/json")
        .send(parent)
        .end((err, response) => {
          if (err) reject(err)
          resolve(JSON.parse(response.text))
        })
    })
  },
  deleteParent: url => {
    return new Promise((resolve, reject) => {
      request
        .delete(url)
        .timeout({
          deadline: 300000, // allow 5 minutes for the file to finish loading.
        })
        .end((err, response) => {
          if (err) reject(err)
          resolve(JSON.parse(response.text))
        })
    })
  },
}
