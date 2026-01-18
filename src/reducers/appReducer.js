import { FormAction, ApiAction } from '../actions/actionTypes';

export const initialState = {
  genre: '',
  mood: '',
  level: '',
  availableMoods: [],
  aiResponses: [],
  loading: false,
  error: null,
};

export function appReducer(state, action) {
  switch (action.type) {
    case FormAction.SET_GENRE:
      return {
        ...state,
        genre: action.payload,
        mood: '',
      };
    case FormAction.SET_MOOD:
      return {
        ...state,
        mood: action.payload,
      };
    case FormAction.SET_LEVEL:
      return {
        ...state,
        level: action.payload,
      };
    case FormAction.UPDATE_AVAILABLE_MOODS:
      return {
        ...state,
        availableMoods: action.payload,
      };
    case ApiAction.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ApiAction.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        aiResponses: [...state.aiResponses, action.payload],
      };
    case ApiAction.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}