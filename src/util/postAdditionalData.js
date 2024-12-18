import axios from "axios";
import { STARDOG_USERNAME, STARDOG_PASSWORD } from '../config';
import {STARDOG_UPDATE} from "../endpoints";

export async function postAdditionalData(queryStr) {
  try {

    // console.log(`src/util/postAdditionalData.js`, `| queryStr:`, queryStr);

    await axios.post(
      STARDOG_UPDATE,
      'query=' + encodeURIComponent(queryStr),
      {
        auth: {
          username: STARDOG_USERNAME,
          password: STARDOG_PASSWORD
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/sparql-results+json'
        }
      }
    );

  } catch (err) {
    // console.error(`src/util/postAdditionalData.js`, `| ERROR:`, err);
      console.error(`src/util/postAdditionalData.js`, `| ERROR:`, err.response ? err.response.data : err);
  }
}