import React from "react";
import {
  Grid,
  CssBaseline,
  Paper,
  Typography,
  makeStyles,
  TextField,
  Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Login.module.css";
import {
  editUsername,
  editPassword,
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  selectAuthen,
  selectIsLoginView,
  fetchAsyncProf,
} from "./loginSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100%",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authen = useSelector(selectAuthen);
  const isLoginView = useSelector(selectIsLoginView);
  // username か password のどちらから空白の場合は、binDisabler がtrueになる
  const btnDisabler = authen.username === "" || authen.password === "";

  const loginSubmit = async (e) => {
    // sleep
    function sleepByPromise(sec) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, sec * 1000);
      });
    }
    // ボタンクリック時に画面のリフレッシュをしないようにする
    e.preventDefault();

    if (isLoginView) {
      // 登録済ユーザのトークンを取得して、タスク一覧へ遷移する
      const resultLogin = await dispatch(fetchAsyncLogin(authen));
      if (fetchAsyncLogin.fulfilled.match(resultLogin)) {
        await sleepByPromise(1);
        await dispatch(fetchAsyncProf());
      }
    } else {
      // 新規ユーザ登録
      const result = await dispatch(fetchAsyncRegister(authen));
      // ユーザ登録完了後に、トークンを取得して、タスク一覧へ遷移する
      if (fetchAsyncRegister.fulfilled.match(result)) {
        const resultLogin = await dispatch(fetchAsyncLogin(authen));
        if (fetchAsyncLogin.fulfilled.match(resultLogin)) {
          await sleepByPromise(1);
          await dispatch(fetchAsyncProf());
        }
      }
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {isLoginView ? "Sign in" : "Sign up"}
          </Typography>
          <form className={classes.form} onSubmit={loginSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="useusernamer"
              label="username"
              name="username"
              onChange={(e) => {
                dispatch(editUsername(e.target.value));
              }}
            />{" "}
              
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => {
                dispatch(editPassword(e.target.value));
              }}
            />
            <Button
              type="submit"
              disabled={btnDisabler}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoginView ? "ログイン" : "ユーザ登録"}
            </Button>
            <Grid container>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => dispatch(toggleMode())}
                >
                  {isLoginView
                    ? "ユーザ登録モードに切替"
                    : "ログインモードに切替"}
                </span>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
