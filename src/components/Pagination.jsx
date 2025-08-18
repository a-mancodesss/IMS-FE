import ChevronFirstIcon from "./icons/ChevronFirstIcon.jsx";
import ChevronLeftIcon from "./icons/ChevronLeftIcon.jsx";
import ChevronRightIcon from "./icons/ChevronRightIcon.jsx";
import ChevronLastIcon from "./icons/ChevronLastIcon.jsx";
import MoreOptionIcon from "./icons/MoreOptionIcon.jsx";

export default function Pagination({
  totalCount,
  noOfDataPerPage,
  currentPage,
  handlePageChange,
}) {
  const noOfPages = Math.ceil(totalCount / noOfDataPerPage);

  return (
    <footer className="flex items-center space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
          disabled={currentPage == 1}
          onClick={() => handlePageChange(1)}
        >
          <ChevronFirstIcon />
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
          disabled={currentPage == 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeftIcon />
        </button>
        {currentPage - 3 > 0 && currentPage == noOfPages && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage - 3)}
          >
            <MoreOptionIcon />
          </button>
        )}
        {currentPage - 2 > 0 && currentPage != noOfPages && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage - 2)}
          >
            <MoreOptionIcon />
          </button>
        )}
        {currentPage - 2 > 0 && currentPage == noOfPages && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage - 2)}
          >
            {currentPage - 2}
          </button>
        )}
        {currentPage - 1 > 0 && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-9 w-9"
        >
          {currentPage}
        </button>
        {currentPage + 1 <= noOfPages && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}
        {currentPage + 2 <= noOfPages && currentPage == 1 && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage + 2)}
          >
            {currentPage + 2}
          </button>
        )}
        {currentPage + 2 <= noOfPages && currentPage != 1 && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage + 2)}
          >
            <MoreOptionIcon />
          </button>
        )}
        {currentPage + 3 <= noOfPages && currentPage == 1 && (
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
            onClick={() => handlePageChange(currentPage + 3)}
          >
            <MoreOptionIcon />
          </button>
        )}
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
          disabled={currentPage >= noOfPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:hover:bg-background disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md px-3"
          disabled={currentPage >= noOfPages}
          onClick={() => handlePageChange(noOfPages)}
        >
          <ChevronLastIcon />
        </button>
      </div>
    </footer>
  );
}
