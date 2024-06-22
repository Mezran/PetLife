// imports
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  selectedPet_id: null,
};

// slice
const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    setSelectedPet_id: (state, action) => {
      state.selectedPet_id = action.payload.selectedPet_id;
    },
    setSelectedPet_idNull: (state) => {
      state.selectedPet_id = null;
    },
  },
});

// actions
export const { setSelectedPet_id, setSelectedPet_idNull } = petSlice.actions;

// reducer
export default petSlice.reducer;
