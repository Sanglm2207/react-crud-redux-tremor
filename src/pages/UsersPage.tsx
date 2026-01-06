import { ListOfUsers } from "../components/ListOfUsers";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      
       <div className="mt-4">
        {/* <CreateNewUser /> */}
        
        <ListOfUsers />
      </div>
    </div>
  );
}