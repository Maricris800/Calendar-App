import { describe, expect, test } from "vitest";
import { authSlice, onLogin, onLogout, clearErrorMessage } from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe("Pruebas en authSlice", () => {

    test("debe retornar el estado inicial", () => {

        expect(authSlice.getInitialState()).toEqual( initialState );

    });

    test( "debe realizar un login", () => {

        const state = authSlice.reducer( initialState, onLogin( testUserCredentials) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined,
        });

    });

    test("debe realizar un logout", () => {
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        });
    });

    test("debe realizar un logout", () => {
        const errorMessage = 'Credenciales no válidas';
        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage,
        });
    });

    test("debe limpiar el mensaje de error", () => {

        const errorMessage = 'Credenciales no válidas';        
        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        const newState = authSlice.reducer( state, clearErrorMessage() );

        expect( newState.errorMessage ).toBeUndefined();
    });

});