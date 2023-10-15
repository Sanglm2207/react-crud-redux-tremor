import "./App.css";
import CreateNewUser from "./components/CreateNewUser";
import { ListOfUsers } from "./components/ListOfUsers";

function App() {
  return (
    <>
      <h1>Dashboard</h1>
      <ListOfUsers />
      <CreateNewUser />
      <Toaster richColors />
    </>
  );
}

export default App;
