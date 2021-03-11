const core = require('@actions/core');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function run() {
  try {
    const folder = core.getInput('jsfolder');
    if(!fs.existsSync(folder)) {
      throw {message: `Folder ${folder} does not exist`};
    }
    fs.readdir(folder, (err, files) => {
      files.forEach(file => {
        if(file.endsWith('.map')) {
          const formData = new FormData();
          formData.append('service_version', core.getInput('service-version'));
          formData.append('service_name', core.getInput('service-name'));
          formData.append('bundle_filepath', `${core.getInput('server-path')}/${file.slice(0, -4)}`);
          formData.append('sourcemap', fs.createReadStream(`${folder}/${file}`, 'utf8'));
          let headers = formData.getHeaders();
          headers['Authorization'] = `Bearer ${core.getInput('apm-token')}`;
          axios.post(
            `${core.getInput('apm-server')}/assets/v1/sourcemaps`,
            formData,
            {
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: headers
            }
          ).then((data) => {
            if(data.status === 202) {
              core.info(`Uploaded ${file} for ${core.getInput('server-path')}/${file.slice(0, -4)}`);
            }
            else {
              core.warning(`Upload of ${file} resulted in a ${data.status} return code instead of the expected 202`);
            }
          }).catch((err) => {
            core.error(`Failed to upload ${file}: ${err.toString()}`);
          });
        }
      });
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
