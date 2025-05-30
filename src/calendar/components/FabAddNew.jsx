import { useCalendarStore, useUiStore } from "../../hooks";
import { addHours } from "date-fns";

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
      setActiveEvent({
        title: "Nuevo evento",
        notes: "Hola, Mundo",
        start: new Date(),
        end: addHours( new Date(), 2 ),
        backgroundColor: "#fafafa",
        user: {
          id: "123",
          name: "Maricris"
        }
      });

      openDateModal();
    }

  return (
    <button
      className="btn btn-primary fab"
      onClick={ handleClickNew }
    >
      <i className="fas fa-plus"></i>
    </button>
  )
}
