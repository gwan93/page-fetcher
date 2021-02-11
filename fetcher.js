const request = require('request');
const fs = require('fs');
const args = process.argv.splice(2);
const url = args[0];
const localFilePath = args[1];
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  // console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
  
  // check if errors
  if (error) {
    console.log(error);
  
  // check if there is a non-200 response code
  } else if (response && response.statusCode !== 200) {
    console.log('Status Code: ' + response.statusCode);

  // check if the file path is valid by checking everything up until the last '/'
  } else if (!fs.existsSync(localFilePath.slice(0, localFilePath.lastIndexOf('/')))) {
    console.log('Please specify a valid file path.');

  // check if the file already exists. If it does, ask user to overwrite or not
  } else if (fs.existsSync(localFilePath)) {
    rl.question(`${localFilePath} already exists. Would you like to overwrite? (y/n): `, function(canOverwrite) {
      if (canOverwrite === 'y') {
        fs.writeFile(localFilePath, body, (err) => {
          if (err) throw err;
          const stats = fs.statSync('index.html');
          const fileSizeInBytes = stats.size;
          console.log("Downloaded and saved " + fileSizeInBytes + " bytes to " + localFilePath);
        });
      } else {
        console.log('Did not download webpage data.');
      }
      rl.close();
    });
    
  // create file if none of the previous conditions fulfilled
  } else {
    fs.writeFile(localFilePath, body, (err) => {
      if (err) throw err;
      const stats = fs.statSync('index.html');
      const fileSizeInBytes = stats.size;
      console.log("Downloaded and saved " + fileSizeInBytes + " bytes to " + localFilePath);
    });
  }
});

