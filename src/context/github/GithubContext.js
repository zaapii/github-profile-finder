import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducers";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    repos: [],
    user: {},
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  const searchUsers = async (search) => {
    setLoading();

    const params = new URLSearchParams({
      q: search,
    });

    const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { items } = await res.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  const getUser = async (login) => {
    setLoading();

    const res = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (res.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await res.json();
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  const getUserRepos = async (login) => {
    setLoading();

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10
    });

    const res = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const data = await res.json();

    dispatch({
      type: "GET_USER_REPOS",
      payload: data,
    });
  };

  const setLoading = () => {
    dispatch({
      type: "SET_LOADING",
    });
  };

  const clearUsers = () => {
    dispatch({
      type: "CLEAR_USERS",
    });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUserRepos,
        getUser
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
