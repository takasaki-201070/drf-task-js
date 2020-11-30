import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import DoneIcon from "@material-ui/icons/Done";
import {
  IconButton,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import { editLogupt } from "../login/loginSlice";
import {
  fetchAsyncDelete,
  fetchAsyncUpdate,
  selectTasks,
  editTask,
} from "./taskSlice";
import styles from "./TaskList.module.css";

const useStyles = makeStyles((theme) => ({
  table: {
    tableLayout: "fixed",
  },
  button: {
    margin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  finsh: {
    color: "red",
  },
  continue: {
    color: "grey",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#6573c3",
    // color: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const TaskList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  // 削除ボタンクリック
  const deleteTask = async (id) => {
    const result = await dispatch(fetchAsyncDelete(id));
    // 削除が異常終了した場合
    if (fetchAsyncDelete.rejected.match(result)) {
      await dispatch(editLogupt(false));
    }
  };
  // 更新ボタンクリック
  const updateTask = async (task) => {
    const result = await dispatch(fetchAsyncUpdate(task));
    // 更新が異常終了した場合
    if (fetchAsyncUpdate.rejected.match(result)) {
      await dispatch(editLogupt(false));
    }
  };
  return (
    <div>
      {tasks[0]?.title && (
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <colgroup>
              <col style={{ width: "80%" }} />
              <col
                style={{
                  width: "10%",
                  minWidth: "10px",
                }}
              />
              <col
                style={{
                  width: "10%",
                  minWidth: "10px",
                }}
              />
            </colgroup>
            {/* テーブルヘッダ */}
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" key="1">
                  <strong>タスク名</strong>
                </StyledTableCell>
                <StyledTableCell align="center" key="2">
                  <strong>削除</strong>
                </StyledTableCell>
                <StyledTableCell align="center" key="3">
                  <strong>完了</strong>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            {/* テーブボディ */}
            <TableBody>
              {tasks.map((task, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  <StyledTableCell
                    align="left"
                    key={`${rowIndex}+1`}
                    onClick={() => {
                      dispatch(editTask(task));
                    }}
                  >
                    {task.title}
                  </StyledTableCell>
                  {/* 削除ボタン */}
                  <StyledTableCell>
                    <IconButton
                      className={styles.tasklist_icon}
                      onClick={() => {
                        deleteTask(task.id);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </StyledTableCell>
                  {/* 完了ボタン */}
                  <StyledTableCell key={`${rowIndex}+2`}>
                    <IconButton
                      onClick={() => {
                        updateTask({
                          id: task.id,
                          title: task.title,
                          finish_flg: !task.finish_flg,
                        });
                      }}
                    >
                      <DoneIcon
                        className={
                          task.finish_flg === true
                            ? classes.finsh
                            : classes.continue
                        }
                      />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TaskList;
