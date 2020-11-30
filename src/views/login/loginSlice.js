import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* -------------------------------------------------
  フロントエンドからdispatchで呼び出される処理
   バックエンドのアプリのＵＲＬとパラメータを渡す定義をする
  ------------------------------------------------- */
//トークンを取得する
export const fetchAsyncLogin = createAsyncThunk("login/post", async (auth) => {
  const res = await axios.post(
    `${process.env.REACT_APP_APIURL}authen/jwt/create`,
    auth,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
});

//ユーザの新規登録
export const fetchAsyncRegister = createAsyncThunk(
  "login/register",
  async (auth) => {
    alert(`URL=${process.env.REACT_APP_APIURL}`);
    const res = await axios.post(
      `${process.env.REACT_APP_APIURL}api/register/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

//プロフィール取得(トークンを渡す)
export const fetchAsyncProf = createAsyncThunk("login/get", async () => {
  const res = await axios.get(`${process.env.REACT_APP_APIURL}api/myself/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

/* -------------------------------------------------
  データ定義
   画面入力値を格納したり、バックエンドからの取得結果を変数定義する
   reducers：画面入力値を受け取るための処理
   extraReducers:バックエンドからの取得完了時に、変数へ格納する処理 
  ------------------------------------------------- */
const loginSlice = createSlice({
  name: "login",
  initialState: {
    authen: {
      username: "",
      password: "",
    },
    isLoginView: true,
    isLoggedIn: false,
    profile: {
      id: 0,
      username: "",
    },
  },
  reducers: {
    // ログイン画面でユーザ名を入力された際に値を格納する
    editUsername(state, action) {
      state.authen.username = action.payload;
    },
    // ログイン画面でパスワードを入力された際に値を格納する
    editPassword(state, action) {
      state.authen.password = action.payload;
    },
    // 画面のモード切替
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
    // ログイン、ログアウト切替
    editLogupt(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchAsyncLoginの結果が正常に終了している場合の動作（fulfilledが正常終了時）
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
      // ログインに成功するとタスクページに遷移する
      state.isLoggedIn = true;
    });

    // fetchAsyncProfの結果が正常に終了している場合の動作（fulfilledが正常終了時）
    builder.addCase(fetchAsyncProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });

    //  fetchAsyncProfの異常終了
    builder.addCase(fetchAsyncProf.rejected, (state) => {
      localStorage.removeItem("localJWT");
      state.isLoggedIn = false;
    });
  },
});
/* -------------------------------------------------
  画面側の reactのコンポーネントでimportするために必要な定義
  ------------------------------------------------- */
// reactのコンポーネントから呼び出せるようにする
export const {
  editUsername,
  editPassword,
  toggleMode,
  editLogupt,
} = loginSlice.actions;
// reactのコンポーネントから参照できるようにする
export const selectAuthen = (state) => state.login.authen;
export const selectIsLoginView = (state) => state.login.isLoginView;
export const selectProfile = (state) => state.login.profile;
export const selectIsLoggedIn = (state) => state.login.isLoggedIn;

export default loginSlice.reducer;
