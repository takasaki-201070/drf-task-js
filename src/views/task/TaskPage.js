import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./TaskPage.module.css";
import TaskList from "./TaskList";
import { fetchAsyncGet } from "./taskSlice";
import TaskForm from "./TaskForm";
import TaskInput from "./TaskInput";

const TaskPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTaskProf = async () => {
      await dispatch(fetchAsyncGet());
    };
    fetchTaskProf();
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className={styles.parentbox}>
        <div className={styles.tasklist}>
          <TaskList />
        </div>
        <div className={styles.taskinput}>
          <TaskInput />
        </div>
      </div>
      <div>
        <TaskForm />
      </div>
    </div>
  );
};

export default TaskPage;
