import { useState, useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import GithubContext from "../../context/github/GithubContext";
import { searchUsers } from "../../context/github/GithubActions";

const UserSearch = () => {
  const [search, setSearch] = useState("")

  const { users, dispatch } = useContext(GithubContext)

  const { setAlert } = useContext(AlertContext)

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!search.length) {
      setAlert('Please enter something', 'error')
      return
    }

    dispatch({type: 'SET_LOADING'})
    const users = await searchUsers(search)
    dispatch({type: 'GET_USERS', payload: users})
    setSearch("")
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 mb-8 gap-8">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <div className="relative">
              <input
                value={search}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search..."
                className="w-full pr-40 bg-gray-200 input input-lg text-black"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 rounded-l-none w-36 btn btn-lg"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {users.length > 0 && (
        <div>
          <button className="btn btn-ghost btn-lg" onClick={() => dispatch({type: 'CLEAR_USERS'})}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
