# Action to run dockerized Cirrus Tasks

This action installs [Cirrus CLI](https://github.com/cirruslabs/cirrus-cli) and runs Cirrus Tasks.

## Inputs

### `version`

**Optional** Version of the CLI. By default, `latest` is used.

### `args`

**Optional** Arguments for the [`run` command](https://github.com/cirruslabs/cirrus-cli#running-cirrus-tasks). 

## Example usage

```yaml
uses: cirruslabs/cirrus-action@v1
with:
  args: 'Test (Go 1.15)'
```

### Full Example

Here is an example of `.github/workflows/cirrus.yml` workflow file that will run all available Cirrus Tasks:

```yaml
name: Run Cirrus Tasks

on: [push, pull_request]

jobs:
  cirrus:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: cirruslabs/cirrus-action@master
```
