# APM Sourcemap Upload Action

A github action to upload sourcemaps from a folder to an Elastic APM server.


## Example Workflow

```yaml
on: [push]

jobs:
  example:
    runs-on: ubuntu-latest
    name: Example workflow
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
      - name: Build
        run: npm run build
      - name: 
        uses: highspeedoffice/apm-sourcemap-upload@v1
        with:
          jsfolder: 'build/static/js'
          apm-server: 'https://apm.yourdomain.com'
          apm-token: ${{secrets.APM_TOKEN}}
          server-path: 'https://test.com/static/js'
          service-name: test
          service-version: whatever
```
