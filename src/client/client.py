# -*- coding: utf-8 -*-

import socket
import sys
import os


def recv_response(sock):
    """
    Receives the full server response.

    Since the server protocol does not provide a special end marker,
    we keep reading until the socket becomes temporarily silent.
    """

    data = ""

    # Small timeout used to detect end of transmission
    sock.settimeout(0.1)

    try:
        while True:
            chunk = sock.recv(1024).decode("utf-8", errors="replace")

            # Empty chunk means server disconnected
            if not chunk:
                return None

            data += chunk

    except socket.timeout:
        # No more data currently available -> response finished
        pass

    finally:
        # Restore blocking mode
        sock.settimeout(None)

    return data


def main():
    """
    Main client entry point.
    Connects to the server and continuously sends user commands.
    """

    # Read server configuration from environment variables
    # Defaults are used for local execution outside Docker
    host = os.environ.get("SERVER_HOST", "localhost")
    port = int(os.environ.get("SERVER_PORT", "9034"))

    # Create IPv4 TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Connect to the TCP server
        sock.connect((host, port))

    except ConnectionRefusedError:
        print("Could not connect to server")
        sys.exit(1)

    # Main interaction loop
    while True:
        try:
            # Read command from console
            command = input()

        except (EOFError, KeyboardInterrupt):
            # Graceful shutdown on Ctrl+D / Ctrl+C
            break

        # Ignore completely empty commands
        if not command.strip():
            continue

        try:
            # Send newline-terminated command
            encoded_command = (command + "\n").encode(
                "utf-8",
                errors="replace"
            )

            sock.sendall(encoded_command)

        except (BrokenPipeError, ConnectionResetError):
            print("Connection lost")
            break

        # Receive server response
        response = recv_response(sock)

        # Server disconnected unexpectedly
        if response is None:
            print("Server disconnected")
            break

        # Print exactly what the server returned
        print(response, end="")

        # Local client shutdown after quit command
        if command.strip().lower() == "quit":
            break

    print()

    # Close socket before exiting
    sock.close()


if __name__ == "__main__":
    main()