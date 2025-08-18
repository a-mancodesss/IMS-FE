export default function LoadingIndicator() {
  return (
    <div className="flex flex-col justify-center items-center">
      <svg className="circular-loader">
        <circle cx="50%" cy="50%" r="15" strokeLinecap="round" />
      </svg>
    </div>
  );
}
