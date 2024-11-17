import fs from "fs";
import moment from "moment";

/**
 * This is Error logger which log error message, remote ip and current timestamp
 * @param {"Error Message"} err 
 * @param {"Ip of request in which error is occured"} ip 
 * @returns 
 */
const errorsLoger = (err, ip) => {
    return new Promise((resolve, reject) => {
        const errMsg = `[Timestamp]: ${moment().format('MMMM Do YYYY, h:mm:ss a')},  [Ip]:  ${ip},  [Error Message]: ${err}\n`;
        console.error("Error ==> ", errMsg);
        fs.appendFile('./ErrorLogs/errorLogs.txt', errMsg, (err) => {
            if (err) reject(err.message);
            resolve("Error Logged")
        });
    })
}

export default errorsLoger;