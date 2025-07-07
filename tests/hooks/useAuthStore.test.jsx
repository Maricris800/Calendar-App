import { beforeEach, describe, expect, test, vi } from "vitest";
import { authSlice } from "../../src/store";
import {initialState, notAuthenticatedState} from "../fixtures/authStates";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });

}

describe("Pruebas en useAuthStore", () => {

    beforeEach( () => localStorage.clear() );

    test("debe regresar los valores por defecto", () => {

        const mockStore = getMockStore({ ... initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        expect( result.current ).toEqual({
           
            errorMessage: undefined,
            status: "checking",
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
            
        });

    });

    test( "startLogin debe realizar el login correctamente", async() => {
        
        const mockStore = getMockStore({ ... notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
           await result.current.startLogin( testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: "Maricris", uid: "682fba94ab4fb97f9a2679cf" }
        });

        expect( localStorage.getItem("token")).toEqual(expect.any(String));
        expect( localStorage.getItem("token-init-date")).toEqual(expect.any(String));

    });

    test("startLogin debe fallar la autenticación", async() => {
               
        const mockStore = getMockStore({ ... notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
           await result.current.startLogin({ email: "algo@google.com", password: "12345678" });
        });

        const { errorMessage, status, user } = result.current;
        expect( localStorage.getItem("token") ).toBeNull();
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Credenciales incorrectas",
            status: "not-authenticated",
            user: {}
        });

        await waitFor(
           () => expect( result.current.errorMessage ).toBe(undefined)
        );

    });

    test("startRegister debe crear un usuario", async() => {
        const newUser = { email: "algo@google.com", password: "123456789", name: "Test User 2" };
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
        });

        const spy = vi.spyOn(calendarApi, "post").mockReturnValue({
            data: {
                ok: true,
                uid: "987654321",
                name: "Test User 2",
                token: "NEW_TOKEN",
            },
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: "Test User 2", uid: "987654321" },            
        });

        spy.mockRestore();

        // expect(localStorage.getItem("token")).toEqual("NEW_TOKEN");
        // expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));          
        
    });

    test('startRegister debe de fallar la creación de un usuario', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Ya existe un usuario con este correo',
            status: 'not-authenticated',
            user: {}
        });

    });    

    test("checkAuthToken debe de fallar si no hay un token", async() => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{ children }</Provider>,
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });        

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "not-authenticated",
            user: {},
        });

    });

    test("checkAuthToken debe autenticar el usuario si hay un token", async() => {

        const { data } = await calendarApi.post("/auth", testUserCredentials);
        localStorage.setItem( "token", data.token );        

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{ children }</Provider>,
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        console.log({ errorMessage, status, user });
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: "Maricris", uid: "682fba94ab4fb97f9a2679cf" },
        });

    });
    
});
