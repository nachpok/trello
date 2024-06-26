import { userService } from "../services/user.service";
export const SET_USERS = "SET_USERS";
export const EDIT_USERS = "EDIT_USERS";
export const SET_USER = "SET_USER"

const initialState = {
  count: 10,
  user: userService.getLoggedinUser(),
  users: [],
  watchedUser: null,
};

export function userReducer(state = initialState, action) {
  var newState = state;
  switch (action.type) {
    case SET_USERS:
      newState = { ...state, users: action.users };
      break;
    case EDIT_USERS:
        newState = {...state, users: [...state.users,action.user],undoUsers: [...state.users] }
    break;
    case SET_USER:
      newState = {...state, user: action.user}
      break
    default:
  }
  // For debug:
  // window.userState = newState
  // console.log('State:', newState)
  return newState;
}
