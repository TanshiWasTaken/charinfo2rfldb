# charinfo2rfldb

A small command-line utility for converting Nintendo Switch Mii files into a Wii-compatible database.

It converts 88-byte Nintendo Switch `.charinfo` (Gen 3) Mii files into a Wii `RFL_DB.dat` database file signed with the required CRC-16 checksum.

## Features

- Parse and downscale Switch Gen 3 `.charinfo` Mii data to Wii Gen 1 (`RCD`) format
- Generate a clean 128 KB Wii Mii database (`RFL_DB.dat`) from scratch
- Automatically calculate and sign the binary with Wii CRC-16-CCITT checksum
- Support custom output filenames and paths

## Requirements

- Node.js (v16 or higher recommended)
- `miijs` library

## Installation

1. Clone or download this repository.
2. Install the required dependency:

```text
npm install miijs
```

## Usage

Run `convert.js` with Node, passing your input file path:

```text
node convert.js <input.charinfo> [output.dat]
```

### Examples

Generate `RFL_DB.dat` in the current folder:

```text
node convert.js my_mii.charinfo
```

Generate with a custom path or filename:

```text
node convert.js my_mii.charinfo ./RFL_DB.dat
```

### File Placement

To use your generated Mii inside Dolphin or Switch Atmosphere (virtual Wii NAND), copy `RFL_DB.dat` to your SD card:

```text
sd:/
└── switch/
    └── dolphin-emu/
        └── User/
            └── Wii/
                └── shared2/
                    └── menu/
                        └── FaceLib/
                            └── RFL_DB.dat
```

*Note: Create the `menu/FaceLib/` directories manually if they do not exist yet.*

## If it doesn't work

If the Mii does not show up in-game:

- Make sure `RFL_DB.dat` is placed in `shared2/menu/FaceLib/` and not directly in `shared2/`
- Ensure your input file is a `.charinfo` dump
- Try launching the game or Mii Channel once so Dolphin initializes the NAND paths
- If all else fails, open an issue stating the origin of your `.charinfo` file, the environment of your Wii (e.g. Dolphin), and the tool/method you used to dump your `.charinfo` file

## Credits

Built using [MiiJS](https://github.com/Stewared/MiiJS)

## License

MIT License
