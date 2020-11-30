import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../views/login/loginSlice";
import taskReducer from "../views/task/taskSlice";

export default configureStore({
  reducer: {
    login: loginReducer,
    task: taskReducer,
  },
});
