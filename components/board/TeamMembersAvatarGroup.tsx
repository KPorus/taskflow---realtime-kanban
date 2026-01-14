import React from "react";
import { User } from "../../types";

interface Props {
  members: User[];
}

export const TeamMembersAvatarGroup: React.FC<Props> = ({ members }) => {
  const visible = members.slice(0, 5);
  const extraCount = members.length - visible.length;

  return (
    <div className="flex items-center -space-x-2 flex-shrink-0">
      {visible.map((user) => (
        <div
          key={user.id}
          className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center"
          title={user.name}
        >
          <span className="text-xs font-bold text-indigo-700">
            {user.name.charAt(0)}
          </span>
        </div>
      ))}
      {extraCount > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
          +{extraCount}
        </div>
      )}
    </div>
  );
};
