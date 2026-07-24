import { createSlice } from "@reduxjs/toolkit";


const initialState = {

  complaint: {},

  messages: [],

  loading: false,

};



const complaintSlice = createSlice({

  name: "complaint",

  initialState,

  reducers: {


    updateComplaint: (state, action) => {

      state.complaint = {

        ...state.complaint,

        ...action.payload,

      };

    },



    setComplaint: (state, action) => {

      state.complaint = action.payload;

    },



    addMessage: (state, action) => {

      state.messages.push(action.payload);

    },



    setMessages: (state, action) => {

      state.messages = action.payload;

    },



    setLoading: (state, action) => {

      state.loading = action.payload;

    },


  },


});



export const {

  updateComplaint,

  setComplaint,

  addMessage,

  setMessages,

  setLoading,

} = complaintSlice.actions;



export default complaintSlice.reducer;