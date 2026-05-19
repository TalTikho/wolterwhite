import socket
import sys
import os

def main():
    # Read from environment variables set in docker-compose.yml
    # Falls back to localhost:9034 if not set (for running outside Docker)
    host = os.environ.get("SERVER_HOST", "localhost")
    port = int(os.environ.get("SERVER_PORT", "9034"))

    # Connect to server
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        sock.connect((host, port))
        print(f"Connected to {host}:{port}")
    except ConnectionRefusedError:
        print(f"Could not connect to {host}:{port}")
        sys.exit(1)

    # Main loop — send commands, print responses
    while True:
        try:
            # Read command from user
            command = input()
        except (EOFError, KeyboardInterrupt):
            # Graceful exit on Ctrl+D or Ctrl+C
            break

        # If user just hits enter, don't send an empty command to the server
        if not command.strip():
            continue

        # Send command to server safely
        try:
            sock.sendall((command + "\n").encode())
        except (BrokenPipeError, ConnectionResetError):
            print("\n❌ Error: Connection to the server was lost. (Broken Pipe)")
            break

        # Read response
        response = ""
        while True:
            try:
                chunk = sock.recv(1024).decode()
            except (ConnectionResetError, ConnectionAbortedError):
                print("\n❌ Error: Connection forcibly closed by the remote server.")
                sys.exit(1)

            if not chunk:
                print("\n🔌 Server disconnected.")
                sys.exit(0)
            
            response += chunk
            
            # 💡 SAFE TIMING LOGIC:
            # Instead of counting arbitrary newlines (which causes hangs on single-line errors),
            # we check if the server has finished sending its current block of data.
            # 
            # Note: If your C++ server sends a specific delimiter like "\n\n" or "\0", 
            # change the check below to: if response.endswith("\n\n"):
            if response.endswith("\n"):
                # If we received data, check if there is any more data immediately waiting in the socket buffer.
                # If there isn't, it means the server finished transmitting its response for this command.
                sock.setblocking(False)
                try:
                    # Peek to see if more data is coming right away
                    peek = sock.recv(1, socket.MSG_PEEK)
                    if not peek:
                        # No data waiting, but socket is open -> Server is done talking for now
                        sock.setblocking(True)
                        break
                except BlockingIOError:
                    # A BlockingIOError means the buffer is empty. Server has finished sending.
                    sock.setblocking(True)
                    break
                finally:
                    sock.setblocking(True)

        # Print response block cleanly
        print(response, end="")

        # If the user issued a quit command, let's exit cleanly on our side too
        if command.strip().lower() == "quit":
            break

    print("\nDisconnecting client.")
    sock.close()

if __name__ == "__main__":
    main()