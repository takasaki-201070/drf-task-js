import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* -------------------------------------------------
  フロントエンドからdispatchで呼び出される処理
   バックエンドのアプリのＵＲＬとパラメータを渡す定義をする
  ------------------------------------------------ */
// タスクの取得
export const fetchAsyncGet = createAsyncThunk("task/get", async () => {
  const res = await axios.get(`${process.env.REACT_APP_APIURL}api/tasks/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});
// タスクの新規登録
export const fetchAsyncCreate = createAsyncThunk("task/post", async (task) => {
  const res = await axios.post(
    `${process.env.REACT_APP_APIURL}api/tasks/`,
    task,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});
// タスクの更新
export const fetchAsyncUpdate = createAsyncThunk("task/put", async (task) => {
  const res = await axios.put(
    `${process.env.REACT_APP_APIURL}api/tasks/${task.id}/`,
    task,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});
// タスクの削除
export const fetchAsyncDelete = createAsyncThunk("task/delete", async (id) => {
  await axios.delete(`${process.env.REACT_APP_APIURL}api/tasks/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return id;
});

/* -------------------------------------------------
  データ定義
   画面入力値を格納したり、バックエンドからの取得結果を変数定義する
   tasks         ：登録済のデータの抽出結果
   editedTask    ：更新対象のデータ
   selectedTask  ：詳細表示の表示内容
   reducers      ：画面入力値を受け取るための処理
   extraReducers :バックエンドからの取得完了時に、変数へ格納する処理 
  ------------------------------------------------ */
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [
      {
        id: 0,
        title: "",
        finish_flg: false,
        created_at: "",
        updated_at: "",
      },
    ],
    editedTask: {
      //更新時に格納する領域
      id: 0,
      title: "",
      finish_flg: false,
      created_at: "",
      updated_at: "",
    },
  },
  reducers: {
    editTask(state, action) {
      state.editedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 取得時は、tasksに格納する
    builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
      return {
        ...state,
        tasks: action.payload,
      };
    });
    // 新規追加時は先頭に追加したデータを、tasksに格納する
    builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    });
    // 更新時は選択されたidに対して、上書きする
    builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
      let tmpTask = {
        //更新時に格納する領域
        id: 0,
        title: "",
        finish_flg: false,
        created_at: "",
        updated_at: "",
      };
      if (state.editedTask.id === action.payload.id) {
        tmpTask = action.payload;
      }
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        editedTask: tmpTask,
      };
    });
    // 削除時
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        editedTask: { id: 0, title: "", created_at: "", updated_at: "" },
      };
    });
    //  取得時の異常終了
    builder.addCase(fetchAsyncGet.rejected, (state) => {
      localStorage.removeItem("localJWT");
    });
    //  新規追加時の異常終了
    builder.addCase(fetchAsyncCreate.rejected, (state) => {
      localStorage.removeItem("localJWT");
    });
    //  更新時の異常終了
    builder.addCase(fetchAsyncUpdate.rejected, (state) => {
      localStorage.removeItem("localJWT");
    });
    //  削除時の異常終了
    builder.addCase(fetchAsyncDelete.rejected, (state) => {
      localStorage.removeItem("localJWT");
    });
  },
});
/* -------------------------------------------------
  画面側の reactのコンポーネントでimportするために必要な定義
  ------------------------------------------------- */
// reactのコンポーネントから呼び出せるようにする
export const { editTask, selectTask } = taskSlice.actions;
// reactのコンポーネントから参照できるようにする
export const selectEditedTask = (state) => state.task.editedTask;
export const selectTasks = (state) => state.task.tasks;

export default taskSlice.reducer;
