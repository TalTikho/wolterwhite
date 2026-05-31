import net from 'net';
// Use net to open a socket - a must for operating as a client.
const client = new net.Socket();

// Connect to the port the cpp server uses (currently with the docker-cpp server container)
client.connect(5555, 'wolterwhite-server', () => { console.log('Connected to C++'); });
// If the connection fails we send an error message.
client.on('error', (err) => console.log('C++ Server offline:', err.message));

// async and promise allow us to handle requests in a way that the response is connected to the right request.
// When one is sent async and promise hold a request until the response comes.
export const sendAndReceive = async (message) => {

  console.log(">> SENDING MESSAGE TO C++:", message);
  // Write the message using net's write.
  client.write(message + '\n');

  // response starts as null. It is defined with let as we will redifine it as a response string.
  let response = null
  await ( new Promise( (resolve, reject) => {
    // once makes us "kill" this method after it is done.
    client.once('data', function(data) {
      response = data.toString();
      // Promise resolved, now on to the next request.
      resolve()
    });
  }))

  return response;

}
