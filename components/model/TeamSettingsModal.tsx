import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Trash2, X, UserPlus } from "lucide-react";
import { Team, User } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  currentUser: User | null;
  isOwner: boolean;
  availableUsers: User[];
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onDeleteTeam: () => void;
}

export const TeamSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  team,
  currentUser,
  isOwner,
  availableUsers,
  onAddMember,
  onRemoveMember,
  onDeleteTeam,
}) => {
  const [selectedUserIdToAdd, setSelectedUserIdToAdd] = useState("");
  console.log(team);
  const handleAdd = () => {
    if (selectedUserIdToAdd) {
      onAddMember(selectedUserIdToAdd);
      setSelectedUserIdToAdd("");
    }
  };
  const members = React.useMemo(() => {
    if (team) return team?.members;
    return [];
  }, [team]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Settings">
      <div className="space-y-6">
        {/* Members */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
            Team Members
          </h4>

          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {members.map((member) => {
              const memberUser =
                typeof member.user === "object" ? (member.user as User) : null;
              if (!memberUser) return null;
              const isSelf = memberUser.id === currentUser?.id;

              return (
                <div
                  key={memberUser.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {memberUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {memberUser.name} {isSelf && "(You)"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {memberUser.email}
                      </p>
                    </div>
                  </div>
                  {isOwner && !isSelf && (
                    <button
                      onClick={() => onRemoveMember(memberUser.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove member"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isOwner && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="flex-1">
                <select
                  value={selectedUserIdToAdd}
                  onChange={(e) => setSelectedUserIdToAdd(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select user to add...</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAdd}
                disabled={!selectedUserIdToAdd}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus size={16} />
                Add
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        {isOwner && (
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Danger Zone
            </h4>
            <div className="border border-red-100 rounded-lg p-4 bg-red-50">
              <p className="text-sm text-red-800 mb-4 font-medium">
                Deleting this team will remove all associated members and
                access.
              </p>
              <button
                onClick={onDeleteTeam}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} />
                Delete Team Forever
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
