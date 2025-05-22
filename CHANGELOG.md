# CHANGELOG for ASAB WebUI Shell

## 25.2.1

- Updated import for isAuthorized from `asab_webui_components` to `asab_webui_components/seacat-auth` (!13)

## 25.1.13

- Update babel.config to allow handling recent features like BigInt on compilation (#14)

## 25.1.12

- Added parsing for `error.response.data` in `axios.interceptors` if `content-type: application/json` (!11)

## 25.1.11

- Upgrade axios peer dependency to `^1.8.4` (!9)

## 25.1.10

- Saving BigInt number in `axios.interceptors` if the type is `application/json` (!6)

## 25.1.9

- Display invitation URL if available (!10)

## 25.1.8

- Make auth header username displayal more defensive (!7)

## 25.1.7

- Upgrade the version

## 25.1.5

- Replace yarn with pnpm in github workflow (!2)

## 25.1.3

### Refactor

- Allow publish to npm only on tag build (!1)
