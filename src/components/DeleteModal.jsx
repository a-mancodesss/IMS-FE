import ReactDOM from "react-dom";

export default function DeleteModal({
  title,
  isModalVisible,
  onToggle,
  confirmDelete,
  message,
  canDelete,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    confirmDelete();
  }

  if (!isModalVisible) {
    return null;
  }

  return ReactDOM.createPortal(
    <section className="fixed top-0 left-0 flex items-center justify-center bg-black/80 w-full h-full z-[1000] transition-all duration-400 ease-in-out">
      <div className="fixed left-[50%] top-[50%] grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[350px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left bg-destructive/15 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h2>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="font-semibold px-4">{message}</div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {canDelete ? (
              <>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-[5.25rem] h-10 px-4 py-2"
                  type="button"
                  onClick={() => onToggle(false)}
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 w-[5.25rem] h-10 px-4 py-2"
                  type="submit"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 w-[5.25rem] h-10 px-4 py-2"
                type="button"
                onClick={() => onToggle(false)}
              >
                Ok
              </button>
            )}
          </div>
        </form>
      </div>
    </section>,
    document.getElementById("modal-root")
  );
}
