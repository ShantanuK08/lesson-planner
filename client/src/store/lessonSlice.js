import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lessons: [],
  selectedLesson: null,
  loading: false,
  error: null,
};

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },
    setSelectedLesson: (state, action) => {
      state.selectedLesson = action.payload;
    },
    addLesson: (state, action) => {
      state.lessons.unshift(action.payload);
    },
    updateLesson: (state, action) => {
      const index = state.lessons.findIndex(l => l.id === action.payload.id);
      if (index !== -1) state.lessons[index] = action.payload;
    },
    deleteLesson: (state, action) => {
      state.lessons = state.lessons.filter(l => l.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLessons, setSelectedLesson, addLesson, updateLesson, deleteLesson, setLoading, setError } = lessonSlice.actions;
export default lessonSlice.reducer;