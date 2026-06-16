export const BackG = () => {
  return (
    <img
      /* Assets in the public folder are served at the root URL '/' so we make absolute linkage here */
      src="/knock.png"
      alt="I am the one who knocks"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
};
