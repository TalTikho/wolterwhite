export const BackG = () => {
  return (
    <img
      /* Assets in the public folder are served at the root URL '/' so we make absolute linkage here */
      src="/knock.png"
      alt="I am the one who knocks"
      style={{
        width: "100%",
        maxWidth:
          "1200px" /* Prevents it from getting too massive on huge screens */,
        height: "auto" /* Maintains perfect proportions */,
      }}
    />
  );
};
