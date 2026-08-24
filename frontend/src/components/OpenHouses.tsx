interface OpenHouseRecord {
  OH_Date: string;
  OH_StartTime: string;
  OH_EndTime: string;
  all_data?: string | null;
}

interface OpenHousesProps {
  openHouses: OpenHouseRecord[] | null | undefined;
}

// Open-house remarks are stored inside the database's all_data JSON field,
// while date and time values are exposed as regular response properties.
export default function OpenHouses({ openHouses }: OpenHousesProps) {
  if (!openHouses || openHouses.length === 0) {
    return <p>No open houses scheduled</p>;
  }

  return (
    <ul className="space-y-4">
      {openHouses.map((oh, i) => {
        let remarks = "";

        // all_data may be null or malformed in older records, so a bad JSON
        // value should remove only the remarks instead of breaking the list.
        try {
          const parsed = JSON.parse(oh.all_data || "{}") as {
            OpenHouseRemarks?: string;
          };
          remarks = parsed.OpenHouseRemarks || "";
        } catch {
          remarks = "";
        }

        return (
          <li key={i} className="border p-4 rounded">
            <p><strong>Date:</strong> {oh.OH_Date}</p>
            <p><strong>Time:</strong> {oh.OH_StartTime} – {oh.OH_EndTime}</p>
            {remarks && (
              <p><strong>Remarks:</strong> {remarks}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
