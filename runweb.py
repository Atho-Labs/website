#!/usr/bin/env python3
# Copyright 2025 Atho Labs (owner hash: 59ff054a16dd5a45aea1ffc4069f5d9ae45282358df89d88a57b2daff67aed13bb03f8e71d6951e80cb04018d982ab6c)
# Licensed under the Apache License, Version 2.0 (the "License");
# Experimental software; provided "as is", without warranties or guarantees of any kind.
# You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software distributed under the
# License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.

from __future__ import annotations

import argparse
import functools
import http.server
import socket
import socketserver
import sys
import webbrowser
from pathlib import Path


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        # Keeps local development refreshes consistent while editing.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Serve atho.io static site locally.")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default: 127.0.0.1).")
    parser.add_argument("--port", type=int, default=8081, help="Bind port (default: 8081).")
    parser.add_argument(
        "--lan",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Bind on LAN (0.0.0.0) and print phone-friendly local URL (default: disabled).",
    )
    parser.add_argument(
        "--open",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Open browser after start (default: disabled).",
    )
    parser.add_argument(
        "--no-cache",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Disable browser caching via response headers (default: enabled).",
    )
    parser.add_argument(
        "--auto-port",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Fallback to a random free port if requested port is in use (default: enabled).",
    )
    return parser


def _display_host(host: str) -> str:
    if host in {"0.0.0.0", "::"}:
        return "127.0.0.1"
    return host


def _detect_lan_ip() -> str | None:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.connect(("8.8.8.8", 80))
        ip = sock.getsockname()[0]
        sock.close()
        if ip and not ip.startswith("127."):
            return ip
    except Exception:
        pass

    try:
        host_info = socket.gethostbyname_ex(socket.gethostname())
        for ip in host_info[2]:
            if ip and not ip.startswith("127."):
                return ip
    except Exception:
        pass
    return None


def main() -> int:
    args = _build_parser().parse_args()
    if args.lan:
        args.host = "0.0.0.0"

    root = Path(__file__).resolve().parent

    handler_cls = NoCacheHandler if args.no_cache else http.server.SimpleHTTPRequestHandler
    handler = functools.partial(handler_cls, directory=str(root))

    try:
        server = ThreadedHTTPServer((args.host, args.port), handler)
    except OSError as exc:
        if not args.auto_port:
            print(f"[runweb] Failed to bind {args.host}:{args.port} -> {exc}", file=sys.stderr)
            return 2
        print(f"[runweb] Port {args.port} unavailable ({exc}). Falling back to random free port.")
        server = ThreadedHTTPServer((args.host, 0), handler)

    actual_port = int(server.server_address[1])
    url = f"http://{_display_host(args.host)}:{actual_port}/"

    print(f"[runweb] Serving: {root}")
    print(f"[runweb] URL: {url}")
    if args.host in {"0.0.0.0", "::"}:
        lan_ip = _detect_lan_ip()
        if lan_ip:
            print(f"[runweb] LAN URL: http://{lan_ip}:{actual_port}/")
            print("[runweb] Phone access: connect phone to same Wi-Fi, then open the LAN URL.")
        else:
            print("[runweb] LAN mode enabled, but local IP could not be detected automatically.")
    print("[runweb] Press Ctrl+C to stop.")

    if args.open:
        webbrowser.open(url, new=2)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[runweb] Stopping server...")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
 