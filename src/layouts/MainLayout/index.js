import React from "react";
import TaskPage from "../../views/task/TaskPage";
import styles from "./MainLayout.module.css";
import TopBar from "./TopBar";

const MainLayout = () => {
  return (
    <div className={styles.root}>
      <TopBar />
      <div className={styles.main}>
        <TaskPage />
      </div>
    </div>
  );
};

export default MainLayout;
