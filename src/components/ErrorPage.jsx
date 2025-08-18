export default function ErrorPage() {
  return (
    <>
      <style>{`
        body {
          color: #000;
          background: #fff;
          margin: 0;
        }
        .next-error-h1 {
          border-right: 1px solid rgba(0, 0, 0, 0.3);
        }
        @media (prefers-color-scheme: dark) {
          body {
            color: #fff;
            background: #000;
          }
          .next-error-h1 {
            border-right: 1px solid rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
      <div
        className="h-[calc(100vh-6rem)] text-center flex flex-col items-center justify-center"
        style={{
          fontFamily:
            'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
        }}
      >
        <div>
          <h1
            className="next-error-h1 inline-block"
            style={{
              margin: "0 20px 0 0",
              padding: "0 23px 0 0",
              fontSize: "24px",
              fontWeight: "500",
              verticalAlign: "top",
              lineHeight: "49px",
            }}
          >
            404
          </h1>
          <div className="inline-block">
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "49px",
                margin: "0",
              }}
            >
              This page could not be found.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
