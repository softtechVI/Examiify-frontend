import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Column {
    key: string;
    label: string;
    render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode; // custom render per cell
}

interface TableProps<T> {
    data: T[];
    columns: Column[];
    getStatusColor?: (status: string) => string;
    onEdit?: (item: T) => void;
    onDelete?: (id: string) => void;
    idField?: string;
    showActions?: boolean;
    emptyMessage?: string;
}

    const Table = <T extends Record<string, any>>({
    data = [],
    columns,
    getStatusColor,
    onEdit,
    onDelete,
    idField = "_id",
    showActions = true,
    emptyMessage = "No records found",
    }: TableProps<T>) => {
    if (!data || data.length === 0) {
        return (
        <div className="p-6 text-center text-gray-500 border rounded-lg bg-gray-50">
            {emptyMessage}
        </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
            <tr>
                {columns.map((col) => (
                <th
                    key={col.key}
                    className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
                >
                    {col.label}
                </th>
                ))}
                {showActions && (onEdit || onDelete) && (
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Actions
                </th>
                )}
            </tr>
            </thead>

            <tbody>
            {data.map((item, index) => (
                <tr
                key={item[idField] || index}
                className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
                >
                {columns.map((col) => {
                    const rawValue = item[col.key];

                    // Normalize display value for arrays/objects/undefined
                    let displayValue: React.ReactNode;
                    if (col.render) {
                        displayValue = col.render(rawValue, item);
                    } else if (rawValue === null || rawValue === undefined) {
                        displayValue = "N/A";
                    } else if (Array.isArray(rawValue)) {
                        displayValue = (rawValue as unknown[]).join(", ");
                    } else if (typeof rawValue === "object") {
                        try {
                            displayValue = JSON.stringify(rawValue);
                        } catch {
                            displayValue = String(rawValue);
                        }
                    } else {
                        displayValue = String(rawValue);
                    }

                    return (
                    <td
                        key={col.key}
                        className="border-b border-gray-200 px-4 py-3 text-gray-800"
                    >
                        {col.key === "status" && getStatusColor ? (
                        // Ensure we always pass a string to the color helper
                        <Badge className={getStatusColor(String(rawValue || ""))}>{displayValue}</Badge>
                        ) : (
                        displayValue
                        )}
                    </td>
                    );
                })}

                {showActions && (onEdit || onDelete) && (
                    <td className="border-b border-gray-200 px-4 py-3 flex gap-2">
                    {onEdit && (
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        >
                        Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onDelete(String(item[idField]))}
                        >
                        Delete
                        </Button>
                    )}
                    </td>
                )}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    export default Table;
