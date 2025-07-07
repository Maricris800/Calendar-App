import { describe, expect, test } from "vitest";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";
import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
 
describe("Pruebas en calendarSlice", () => {
    test("debe regresar el estado por defecto", () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test("onSetActiveEvent debe activar un evento", () => {
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );        
        expect(state.activeEvent).toEqual( events[0] );
    });

    test("onAddNewEvent debe agregar un nuevo evento", () => {
        const newEvent = {
            id: "3",
            start: new Date("2025-15-06 10:00:00"),
            end: new Date("2025-15-06 12:00:00"),
            title: "Nuevo Evento",
            notes: "Notas del nuevo evento",            
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect(state.events).toEqual([ ...events, newEvent ]);
        
    });

    test("onUpdateEvent debe actualizar un evento", () => {
        const updatedEvent = {
            id: "1",
            start: new Date("2025-15-06 10:00:00"),
            end: new Date("2025-15-06 12:00:00"),
            title: "Nuevo Evento actualizado",
            notes: "Notas del nuevo evento actualizado",                        
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );

    });

    test("onDeleteEvent debe borrar el evento activo", () => {
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe( null );
        expect( state.events ).not.toContain( events[0] );
    });

    test("onLoadEvents debe establecer los eventos", () => {
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.isLoadingEvents ).toBeFalsy();
        expect( state.events ).toEqual( events );

        const newEvent = calendarSlice.reducer( state, onLoadEvents( events ) );
        expect( state.events.length ).toBe( events.length );
    });

    test("onLogoutCalendar debe limpiar el estado", () => {

        const state = calendarSlice.reducer( calendarWithEventsState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );      

    });

});