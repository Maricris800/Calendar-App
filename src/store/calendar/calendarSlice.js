
import { createSlice } from '@reduxjs/toolkit';
import { onLogout } from '../auth/authSlice';

//import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: "Cumpleaños del jefe",
//     notes: "Hay que comprar el pastel",
//     start: new Date( ),
//     end: addHours(new Date(), 2 ),
//     bgcolor: "#fafafa",
//     user: {
//         _id: "123",
//         name: "Maricris",
//     },
    
// }

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState:{
        isLoadingEvents: true,
        events: [
        //tempEvent,
      ],
      activeEvent: null,
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {
                if (event.id === payload.id) {
                    return payload;
                }
                return event;
            });
        },
        onDeleteEvent: ( state ) => {
            if ( state.activeEvent ) {
                state.events = state.events.filter( event => event.id !== state.activeEvent.id );
                state.activeEvent = null;
            };
            
        },
        onLoadEvents: ( state, { payload = [] } ) => {
            state.isLoadingEvents = false;
            //state.events = payload;
            payload.forEach( event => {
                const exists = state.events.some( dbEvent => dbEvent.id === event.id);
                if ( !exists ) {
                    state.events.push( event );
                }
            });            
        },
        onLogoutCalendar: ( state ) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = null;
        }

    }
});

export const { 
    onSetActiveEvent, 
    onAddNewEvent, 
    onUpdateEvent, 
    onDeleteEvent, 
    onLoadEvents,
    onLogoutCalendar,
} = calendarSlice.actions;