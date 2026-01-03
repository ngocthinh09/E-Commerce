import Header from "../components/Header";

function NotFound() {
  const messageStyle = {
    fontFamily: "Times New Roman",
    fontSize: "30px",
    textAlign: "center",
    marginTop: "100px"
  };

  return (
    <>
      <Header />
      <div style={messageStyle}>Page not found</div>
    </>
  );
}

export default NotFound;
