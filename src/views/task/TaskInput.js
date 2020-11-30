import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";
import styles from "./TaskInput.module.css";
import { useDispatch } from "react-redux";
import { fetchAsyncCreate } from "./taskSlice";
import { editLogupt } from "../login/loginSlice";

const useStyles = makeStyles((theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
    width: "calc(100% - 104px - 30px)",
  },
  button: {
    position: "absolute",
    width: "24px",
    right: "30px",
    marginRight: "20px",
  },
}));

const TaskInput = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const btnDisabler = title === "";

  // 登録ボタンクリック
  const insertTask = async (taskTitle) => {
    const result = await dispatch(
      fetchAsyncCreate({ id: 0, title: taskTitle, finish_flg: false })
    );
    // 登録処理が異常終了した場合
    if (fetchAsyncCreate.rejected.match(result)) {
      await dispatch(editLogupt(false));
    } else {
      await setTitle("");
    }
  };

  return (
    <div className={styles.root}>
      <form
        onSubmit={() => {
          insertTask(title);
        }}
      >
        <TextField
          className={classes.field}
          value={title}
          onChange={(e) => {
            if (e.key !== "Enter") {
              setTitle(e.target.value);
            }
          }}
          placeholder="タスクの新規追加"
        />
        <Button
          type="submit"
          disabled={btnDisabler}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          登録
        </Button>
      </form>
    </div>
  );
};

export default TaskInput;
