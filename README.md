# Stringtools

Stringtools is a web-based application that provides various tools for developers, such as JSON formatter, hash generator, encoder/decoder, and more. All tools run entirely on the client side (browser), so your data remains private and secure.

## Features

- **JSON Formatter**: Quickly format and validate JSON.
- **REST API Tool**: Easily create and format cURL commands.
- **Encoder & Decoder**: Supports Base64, URL encode/decode, HTML Entity, and Hex.
- **Hash Generator**: Generate MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes.
- **String Diff**: Compare two texts and see the differences visually.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [Angular CLI](https://angular.io/cli)

### Installation


Clone Repository:

```bash
git clone https://github.com/fathurgen/string-tools.git
```


Install all required dependencies:

```bash
cd string-tools
npm install
```

### Development Server

To start the development server, run:

```bash
ng serve
```

Open your browser and go to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Production Build

To build the app for production:

```bash
ng build --configuration=production
```

The build output will be stored in the `dist/` directory.

### Running Unit Tests

To execute unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

### Running End-to-End Tests

To execute end-to-end tests:

```bash
ng e2e
```

## Usage

1. **Open the App**: Access the app in your browser at `http://localhost:4200/`.
2. **Select a Tool**: Use the navigation tabs to choose the tool you need (e.g., JSON Formatter, Encoder, Hash Generator).
3. **Input Data**: Enter your text or data in the input area.
4. **View Results**: The processed result will be displayed below the input form.
5. **Copy or Clear**: Use the "Copy" button to copy the result or "Clear" to reset the input.

## Data Security

All processing is done locally in your browser. No data is sent to any server, ensuring your privacy.

## Contribution

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Open a pull request describing your changes.

If you find any issues or have suggestions, feel free to open an issue.


## Contributors

* [mashurimansur](https://github.com/mashurimansur) dark/light theme
* [benebobaa](https://github.com/benebobaa) markdown preview
* [EzraFathurrahman](https://github.com/EzraFathurrahman) qrcode generator/extractor

<!-- <a href="https://github.com/fathurgen/string-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fathurgen/string-tools" />
</a> -->

## License

This project is licensed under the [MIT License](LICENSE).

## More Information

For more details about Angular CLI, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).