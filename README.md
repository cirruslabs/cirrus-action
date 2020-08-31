# Hello world javascript action

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