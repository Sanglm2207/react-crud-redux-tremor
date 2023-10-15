import React from "react";
import { deleteUserById } from "../store/users/slice";
const dispatch = useAppDispatch();

export const useUserActions = () => {
  const handleRemoveById = (id: UserId) => {
    dispatch(deleteUserById(id));
  };

  return { handleRemoveById };
};
