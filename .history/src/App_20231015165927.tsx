import "./App.css";
import { ListOfUsers } from "./components/ListOfUsers";

function App() {
  return (
    <>
      <h1>Dashboard</h1>
      <ListOfUsers />
      <CreateNewUser />
    </>
  );
}

export default App;
