import Header from "../components/Header";

function NotFound({ cart }) {
  const messageStyle = {
    fontFamily: "Times New Roman",
    fontSize: "30px",
    textAlign: "center",
    marginTop: "100px"
  };

  return (
    <>
      <Header cart={cart} />
      <div style={messageStyle}>Page not found</div>
    </>
  );
}

export default NotFound;
