export default function NoTableData({ tableType }) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 h-24 text-center" colSpan="10">
        No {tableType} found.
      </td>
    </tr>
  );
}
