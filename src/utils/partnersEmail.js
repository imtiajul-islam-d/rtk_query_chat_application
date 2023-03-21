const partnersEmail = (users) => {
  let myEmail = JSON.parse(localStorage.getItem("auth"));
  myEmail = myEmail?.user.email;
  const partnersEmail = users?.filter((email) => email.email !== myEmail);
  return partnersEmail;
};

export default partnersEmail;
