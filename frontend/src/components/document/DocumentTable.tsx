import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export const getBgAndBorder = (darkMode: boolean) =>
  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

export const getTextSecondary = (darkMode: boolean) =>
  darkMode ? "text-gray-400" : "text-gray-500";

interface DocumentTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
  emptyMessage?: string;
}

const DocumentTable = ({ headers, data, renderRow }: DocumentTableProps) => {
  const { darkMode } = useContext(ThemeContext);
  const bgAndBorder = getBgAndBorder(darkMode);
  const textSecondary = getTextSecondary(darkMode);
  const theadBgColor = darkMode
    ? "bg-gray-750 text-gray-300"
    : "bg-gray-50 text-gray-600";

  return (
    <div className={`${bgAndBorder} border rounded-lg overflow-hidden`}>
      <table className="w-full">
        <thead className={`text-xs ${theadBgColor}`}>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="text-left px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data && data.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className={`px-4 py-6 text-center ${textSecondary}`}
              ></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
