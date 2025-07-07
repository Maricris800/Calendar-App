import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks";

vi.mock("../../../src/hooks/useCalendarStore")

describe("Pruebas en <FabDelete />", () => {

    const mockStartDeletingEvent = vi.fn();
    beforeEach( () => vi.clearAllMocks() );    

    test("debe mostrar el componente correctamente", () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: false,
        });

       render(<FabDelete />);        

        const btn = screen.getByLabelText("btn-delete");
        expect( btn.classList ).toContain("btn");
        expect( btn.classList ).toContain("btn-danger");
        expect( btn.classList ).toContain("fab-danger");
        expect( btn.style.display ).toBe("none");

    });

    test("debe mostrar el botón si hay un evento activo", () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText("btn-delete");
        expect( btn.style.display ).toBe("");

    });

    test("debe llamar a startDeletingEvent al hacer click", () => {

        const startDeletingEvent = vi.fn();

        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText("btn-delete");
        fireEvent.click(btn);

        expect(mockStartDeletingEvent).toHaveBeenCalled();


    });



});