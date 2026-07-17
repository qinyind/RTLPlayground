# Repository Guidelines

## Project Structure & Module Organization

The entry point is `rtlplayground.c`. Hardware support is in `rtl837x_*.c/.h`; board mappings are in `machine.c/.h`. Commands and persisted configuration use `cmd_parser.c` and `cmd_editor.c`. Networking is under `uip/`, HTTP code under `httpd/`, and browser assets under `html/`; builds generate `html_data.c/.h`. Host tools are in `tools/`, packaging in `installer/`, and documentation in `doc/`.

## Build, Test, and Development Commands

Install GCC, Make, json-c, and SDCC 4.5 or newer as described in `README.md`.

- `make MACHINE=PCB_K0402WS_V3` builds a 512 KiB image into `output/<machine>/`.
- `make machine_check` compiles `machine.c` for every supported machine definition.
- `make version.h && make -C tools` builds the host utilities and HTTP simulator.
- `tools/output/httpd_sim` serves the simulated UI on port 8080.
- `make -C installer` creates an OEM upgrade image after the main build.
- `make clean` removes intermediates; `make distclean` removes the selected build directory.

`machine_check` does not replace an explicit target build.

## Flash Images & Board Selection

Match the PCB silkscreen, not the product name. `PCB-K0402W-V3.0 / DIP-K0402WS-V3.0` uses `MACHINE=PCB_K0402WS_V3`. Another RTL8372 target may boot but have incorrect port, SFP, or LED mappings.

Firmware is 512 KiB even when the SPI chip is 2 MiB. The Web updater stages and CRC-checks exactly 512 KiB at `0x80000`; upload only the normal `.bin`. Never use a zero-padded 2 MiB file as a universal image.

For SPI programming, write the 512 KiB image at `0x000000` when supported. If a tool requires a full-chip image, merge it into a verified dump from that chip and preserve the remaining bytes. On dual-Flash boards, back up both chips and keep one original bank recoverable.

## Coding Style & Naming Conventions

Follow nearby C style: tabs, same-line braces, `snake_case` names, and uppercase constants. Preserve SDCC qualifiers such as `__code`, `__xdata`, and `__banked`; bank placement is part of the design. Use fixed-width types, avoid large automatic buffers, and never hand-edit generated `version.h` or `html_data.c/.h`.

## Testing Guidelines

At minimum, run `make machine_check` and build the affected board. Exercise UI changes in the simulator and include screenshots. Document hardware tests with the board, chip revision, port type, link speed, and UART evidence.

## Commit & Pull Request Guidelines

Use a short imperative subject; plain subjects and prefixes such as `fix:` are accepted. Pull requests should state motivation, affected machines, verification, and hardware results. Call out flash-layout or register changes and attach UI screenshots.
