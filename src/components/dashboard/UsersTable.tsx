import React from "react";
import { PUser as User } from "@/types/UserTypes";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
}) => {
  const { fullName, email, isVerified, profilePicture } = user;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <Image
            src={profilePicture?.url}
            alt={fullName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-md object-cover mr-3"
          />
        </div>
      </td>
      <td className="py-4 px-6 font-medium text-gray-900">{fullName}</td>
      <td className="py-4 px-6 text-gray-600">{email}</td>
      <td className="py-4 px-6 text-gray-600">
        {isVerified ? (
          <span className="text-green-500">Verified</span>
        ) : (
          <span className="text-red-500">Not Verified</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </button>
          <button
            onClick={() => onDelete(user)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </button>
          <button
            className="text-green-500 hover:text-green-800"
            onClick={() => onView(user)}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900"
            >
              Profile Picture
            </th>
            <th
              scope="col"
              className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900"
            >
              Full Name
            </th>

            <th
              scope="col"
              className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900"
            >
              Email
            </th>
            <th
              scope="col"
              className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900"
            >
              Verified
            </th>
            <th
              scope="col"
              className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 px-6 text-center text-gray-500">
                No users found. Please add some users.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
