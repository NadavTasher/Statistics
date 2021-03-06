# Statistics

Statistics is a simple statistics application for use with generic web-apps and [Caddy](https://caddyserver.com/) webservers.

## Installation

Add the log configuration to your Caddy configuration:
```caddy
:443 {
    log {
        output net udp/statistics:9000
        format json
    }
}
```

## Usage

Modify the configuration file as necessary.

### Web-App integration

Add this line to a click listener:
```js
fetch("https://example.com/api/tag/update?tag=TagID").then();
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)