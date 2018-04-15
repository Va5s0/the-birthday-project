import request from "superagent/lib/client"

export default {
  getNames: url => {
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
}
