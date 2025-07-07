

export const events = [
    { 
        id: '1',
        start: new Date( "2025-06-10 13:00:00" ),
        end: new Date( "2025-06-10 15:00:00" ),
        title: "Cumpleaños del jefe",
        notes: "Hay que comprar el pastel",       
    
    }, 
    
    { 
        id: '2',
        start: new Date( "2025-06-11 13:00:00" ),
        end: new Date( "2025-06-11 15:00:00" ),
        title: "Reunión de equipo",
        notes: "Revisar el proyecto y asignar tareas",       
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null,
};

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: { ...events[0] } 
};
