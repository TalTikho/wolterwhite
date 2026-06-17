export const BackG = () => {
  return (
    <div
      style={{
        //Lock to the screen and hold the background color.
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh", // dvh prevents the bottom from hiding under mobile browser bars
        zIndex: 0,
        backgroundColor: "#10150c", // Fallback color
        overflow: "hidden", // Prevents the blur from creating scrollbars
      }}>


      <img
        /* Assets in the public folder are served at the root URL '/' so we make absolute linkage here */
        src="/knock.png"
        alt="I am the one who knocks"
        style={{
          //main artwork
          position: "absolute", top: 0, left: 0,
          height: "100%",
          width: "100%",
          transform: "scale(0.95)",
        }}
      />
    </div>
  );

};
