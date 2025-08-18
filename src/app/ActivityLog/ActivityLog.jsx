import PageHeader from "../../components/PageHeader.jsx";
import Table from "../../components/Table.jsx";

export default function ActivityLog() {
  return (
    <>
      <PageHeader title="Activity Log"></PageHeader>
      <Table configKey="activity" />
    </>
  );
}
