import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Grid,
  Switch,
  Drawer,
  makeStyles,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { fetchAsyncUpdate, selectEditedTask, editTask } from "./taskSlice";
import { editLogupt } from "../login/loginSlice";

const useStyles = makeStyles((theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
}));

const initialState = {
  id: 0,
  title: "",
  finish_flg: false,
  created_at: "",
  updated_at: "",
};

const TaskForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editedTask = useSelector(selectEditedTask);

  const isDisabled = editedTask.title.length === 0;
  const drawerOpen = editedTask.title !== "";

  // 更新ボタンクリック
  const updateTask = async (task) => {
    const result = await dispatch(
      fetchAsyncUpdate({
        id: task.id,
        title: task.title,
        finish_flg: task.finish_flg,
      })
    );
    // 更新が異常終了した場合
    if (fetchAsyncUpdate.rejected.match(result)) {
      await dispatch(editLogupt(false));
    } else {
      dispatch(editTask(initialState));
    }
  };

  return (
    <Drawer
      anchor="right"
      width="300px"
      open={drawerOpen}
      onClose={() => {
        dispatch(editTask(initialState));
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="flex-start"
        style={{ minHeight: "80vh", marginTop: "10%" }}
      >
        <Grid item>
          {editedTask.title && (
            <>
              <TextField
                className={classes.field}
                label="タスク名"
                type="text"
                name="title"
                value={editedTask.title}
                onChange={(e) => {
                  dispatch(
                    editTask({
                      ...editedTask,
                      title: e.target.value,
                      editFlg: true,
                    })
                  );
                }}
              />
              <br />

              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>未完了</Grid>
                <Grid item>
                  <Switch
                    checked={editedTask.finish_flg}
                    onChange={() => {
                      dispatch(
                        editTask({
                          ...editedTask,
                          finish_flg: !editedTask.finish_flg,
                        })
                      );
                    }}
                    name="checkedC"
                  />
                </Grid>
                <Grid item>完了</Grid>
              </Grid>
              <br />

              <TextField
                className={classes.field}
                InputLabelProps={{
                  readOnly: true,
                }}
                label="登録日時"
                type="text"
                name="created_at"
                value={editedTask.created_at}
              />
              <br />

              <TextField
                className={classes.field}
                InputLabelProps={{
                  readOnly: true,
                }}
                label="更新日時"
                type="text"
                name="updated_at"
                value={editedTask.updated_at}
              />
              <br />

              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<SaveIcon />}
                disabled={isDisabled}
                onClick={() => {
                  updateTask(editedTask);
                }}
              >
                {editedTask.id !== 0 ? "更新" : "追加"}
              </Button>

              <Button
                variant="contained"
                color="default"
                size="small"
                onClick={() => {
                  dispatch(editTask(initialState));
                }}
              >
                取消
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default TaskForm;
