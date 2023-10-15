import React from "react";
import { UserId, deleteUserById } from "../store/users/slice";
import { useAppDispatch } from "./store";

const dispatch = useAppDispatch();

export const useUserActions = () => {
  const removeUser = (id: UserId) => {
    dispatch(deleteUserById(id));
  };

  return { removeUser };
};
