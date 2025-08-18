import { useState, useEffect, useContext } from "react";

import LogData from "./LogData.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";

import { dateFormatter, getTime } from "../../utils/formatter.js";
import getEndpoint from "../../constants/apiEndpoints.js";
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

export default function RecentActivity() {
  const [logData, setLogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        const fetchUrl = getEndpoint("dashboard", "getRecentActivities");

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setLogData(responseBody.data);
          setIsLoading(false);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchActivityData();
  }, []);

  return (
    <article className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-3">
      <header className="flex flex-col space-y-1.5 p-6 bg-primary/5 mb-4 rounded-t-lg">
        <div className="text-2xl font-semibold leading-none tracking-tight">
          Recent Activity
        </div>
        <div className="text-sm text-muted-foreground">
          Latest 5 activities in the system
        </div>
      </header>
      <section className="p-6 pt-0">
        <div className="space-y-6">
          {isLoading && (
            <div className="h-[300px] flex justify-center items-center">
              <LoadingIndicator />
            </div>
          )}
          {logData.length !== 0 &&
            logData.map((singleLog) => (
              <LogData
                key={singleLog._id}
                profileInitials={singleLog.performedByName[0].toUpperCase()}
                userName={singleLog.performedByName}
                action={singleLog.description}
                date={dateFormatter(singleLog.createdAt)}
                time={getTime(singleLog.createdAt)}
              />
            ))}
        </div>
      </section>
    </article>
  );
}
