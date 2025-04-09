import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

interface DocumentRowProps {
  item: any;
  columns: Array<{
    key: string;
    render?: (value: any) => React.ReactNode;
  }>;
  actions: React.ReactNode;
}

const DocumentListRow = ({ item, columns, actions }: DocumentRowProps) => {
  const { darkMode } = useContext(ThemeContext);
  const hoverBgColor = darkMode ? "hover:bg-gray-750" : "hover:bg-gray-50";

  return (
    <tr className={`${hoverBgColor} cursor-pointer`} key={item.id}>
      {columns.map((column, index) => (
        <td className="px-4 py-3" key={index}>
          {column.render ? column.render(item[column.key]) : item[column.key]}
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex space-x-2">{actions}</div>
      </td>
    </tr>
  );
};

export default DocumentListRow;
