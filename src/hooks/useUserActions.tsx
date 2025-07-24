import { User, UserId, addNewUser, deleteUserById } from "../store/users/slice";
import { useAppDispatch } from "./store";

export const useUserActions = () => {
  const dispatch = useAppDispatch();

  const addUser = ({ name, email }: User) => {
    dispatch(addNewUser({ name, email }));
  };

  const removeUser = (id: UserId) => {
    dispatch(deleteUserById(id));
  };

  return { addUser, removeUser };
};
