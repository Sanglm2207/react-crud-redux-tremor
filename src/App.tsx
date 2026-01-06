import CreateNewUser from "./components/CreateNewUser";
import { ListOfUsers } from "./components/ListOfUsers";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <div className="max-w-screen-xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <ListOfUsers />
        <CreateNewUser />
        <Toaster richColors />
    </div>
    </>
  );
}

export default App;
