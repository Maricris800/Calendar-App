import { onCloseDateModal, onOpenDateModal, uiSlice } from '../../../src/store/ui/uiSlice';
import { describe, expect, test } from 'vitest';

describe('Pruebas en uiSlice', () => {
    test('debe retornar el estado por defecto', () => {
       
        expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false })

    });

    test('debe cambiar el estado isDateModalOpen correctamente', () => {
        let state = uiSlice.getInitialState();
        
        state = uiSlice.reducer(state, onOpenDateModal());
        expect(state.isDateModalOpen).toBeTruthy();

        state = uiSlice.reducer(state, onCloseDateModal());
        expect(state.isDateModalOpen).toBeFalsy();
    })
});