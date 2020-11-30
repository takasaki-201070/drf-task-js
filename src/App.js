import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./App.module.css";
import {
  selectIsLoggedIn,
  editLogupt,
  fetchAsyncProf,
} from "./views/login/loginSlice";
import Login from "./views/login/Login";
import MainLayout from "./layouts/MainLayout";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // ログイン済かチェックする
  useEffect(() => {
    const token = `${localStorage.localJWT}`;
    if (token !== "undefined") {
      dispatch(editLogupt(true));
      dispatch(fetchAsyncProf());
    } else {
      dispatch(editLogupt(false));
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.app}>
          <MainLayout />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
