/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import { FileQuestion } from "lucide-react";

export function EmptyState({ message, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
      <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">
        No Show Rooms Found
      </h3>
      <p className="text-gray-500 mb-4 max-w-md">{message}</p>
      <Button onClick={onReset} variant="outline">
        Reset Search
      </Button>
    </div>
  );
}
