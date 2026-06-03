/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  AngleDownIcon,
  AngleUpIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../../../icons";
import PaginationWithButton from "./PaginationWithButton";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type SortKey =
  | "username"
  | "email"
  | "role";

type SortOrder = "asc" | "desc";

export default function UserManagementTable() {
    const createModal = useModal();
    const editModal = useModal();
    const successModal = useModal();
    const errorModal = useModal();
    const deleteModal = useModal();
    const [userToDelete, setUserToDelete] =useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] =useState(true);
    const [sortKey, setSortKey] = useState<SortKey>("username");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [createFormData, setCreateFormData] =
    useState({
        username: "",
        email: "",
        password: "",
        role: "ROLE_USER",
    });

    const closeCreateModal = () => {
  setCreateFormData({
    username: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  createModal.closeModal();
};

    const [formData, setFormData] =
    useState({
        username: "",
        email: "",
        password: "",
        role: "ROLE_USER",
    });



const loadUsers = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    setUsers(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const filteredAndSortedData = useMemo(() => {
  return users
    .filter(
      (item) =>
        item.username
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.email
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.role
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? String(a[sortKey]).localeCompare(
            String(b[sortKey])
          )
        : String(b[sortKey]).localeCompare(
            String(a[sortKey])
          )
    );
}, [
  users,
  searchTerm,
  sortKey,
  sortOrder,
]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleCreate = async () => {
    if (
  !createFormData.username ||
  !createFormData.email ||
  !createFormData.password
) {
 setFormError(
    "Semua Field wajib diisi"
  );
  return;
}
setSaving(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createFormData),
      }
    );
    setSuccessMessage("User berhasil ditambahkan");
    successModal.openModal();
    if (!response.ok) {
      throw new Error("Gagal tambah user");
    }

    createModal.closeModal();

    setCreateFormData({
      username: "",
      email: "",
      password: "",
      role: "ROLE_USER",
    });

    await loadUsers();

    successModal.openModal();
  }catch (error) {
  console.error(error);

  setErrorMessage("Gagal menambahkan user");
  errorModal.openModal();
}finally {
   setSaving(false);
}
};

const handleDelete = async () => {
  if (!userToDelete) return;
setSaving(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userToDelete.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Gagal hapus user");
    }

    deleteModal.closeModal();

    setUserToDelete(null);

    await loadUsers();

    setSuccessMessage("User berhasil dihapus");
    successModal.openModal();

  } catch (error) {
  console.error(error);

  setErrorMessage("Gagal menghapus user");
  errorModal.openModal();
}finally {
   setSaving(false);
}
};

const openEditModal = (user: User) => {
  setSelectedUser(user);

  setFormData({
    username: user.username,
    email: user.email,
    password: "",
    role: user.role,
  });

  editModal.openModal();
};

const handleUpdate = async () => {
  if (!selectedUser) return;
if (
  !formData.username ||
  !formData.email
) {
  setErrorMessage("Username dan Email wajib diisi");
  errorModal.openModal();
  return;
}
setSaving(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal update");
    }

    editModal.closeModal();

    await loadUsers();
    setSuccessMessage("User berhasil diperbarui");
    successModal.openModal();
  } catch (error) {
  console.error(error);

  setErrorMessage("Gagal memperbarui user");
  errorModal.openModal();
}finally {
   setSaving(false);
}
};

  useEffect(() => {
  loadUsers();
}, []);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

const closeEditModal = () => {
  setSelectedUser(null);

  setFormData({
    username: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });

  editModal.closeModal();
};

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
<Button
  size="sm"
  onClick={createModal.openModal}
>
  + Tambah User
</Button>
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option
                  key={value}
                  value={value}
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  {value}
                </option>
              ))}
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>
        </div>

        <div className="relative">
          <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill=""
              />
            </svg>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
  {
    key: "username",
    label: "Username",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
].map(({ key, label }) => (
                  <TableCell
                    key={key}
                    isHeader
                    className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleSort(key as SortKey)}
                    >
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                        {label}
                      </p>
                      <button className="flex flex-col gap-0.5">
                        <AngleUpIcon
                          className={`text-gray-300 dark:text-gray-700 ${
                            sortKey === key && sortOrder === "asc"
                              ? "text-brand-500"
                              : ""
                          }`}
                        />
                        <AngleDownIcon
                          className={`text-gray-300 dark:text-gray-700 ${
                            sortKey === key && sortOrder === "desc"
                              ? "text-brand-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Action
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                <TableRow>
                <TableCell
                colSpan={4}
                    className="text-center py-10"
                >
                    Loading...
                </TableCell>
                </TableRow>
            ) : (
                currentData.length === 0 ? (
  <TableRow>
    <TableCell
      colSpan={4}
      className="py-10 text-center"
    >
      Data tidak ditemukan
    </TableCell>
  </TableRow>
) : (
             currentData.map((user) => (
                <TableRow  key={user.id}>
                  <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                    {user.username}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                      {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-4 border">
                    <span
                    className={
                        user.role === "ROLE_ADMIN"
                        ? "text-green-600 font-semibold"
                        : "text-blue-600 font-semibold"
                    }
                    >
                    {user.role}
                    </span>
                </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                    <div className="flex items-center w-full gap-2">
                        <button
                        onClick={() => {
                            setUserToDelete(user);
                            deleteModal.openModal();
                        }}
                        className="text-red-500"
                        >
                        <TrashBinIcon />
                        </button>
                    <button
                     onClick={() => openEditModal(user)}
                    className="text-gray-500 hover:text-gray-800"
                    >
                    <PencilIcon />
                    </button>
                    </div>
                  </TableCell>
                </TableRow>
           ))

))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          {/* Left side: Showing entries */}

          <PaginationWithButton
            totalPages={totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
          />
          <div className="pt-3 xl:pt-0">
            <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
              Showing {startIndex + 1} to {endIndex} of {totalItems} entries
            </p>
          </div>
        </div>
      </div>
<Modal
  isOpen={editModal.isOpen}
  onClose={editModal.closeModal}
  className="max-w-[600px] p-6"
>
  <h4 className="mb-6 text-xl font-semibold">
    Edit User
  </h4>

  <div className="space-y-4">

    <input
      type="text"
      value={formData.username}
      onChange={(e) =>
        setFormData({
          ...formData,
          username: e.target.value,
        })
      }
      placeholder="Username"
      className="w-full p-3 border rounded-lg"
    />

    <input
      type="email"
      value={formData.email}
      onChange={(e) =>
        setFormData({
          ...formData,
          email: e.target.value,
        })
      }
      placeholder="Email"
      className="w-full p-3 border rounded-lg"
    />

    <input
      type="password"
      value={formData.password}
      onChange={(e) =>
        setFormData({
          ...formData,
          password: e.target.value,
        })
      }
      placeholder="Kosongkan jika tidak diganti"
      className="w-full p-3 border rounded-lg"
    />

    <select
      value={formData.role}
      onChange={(e) =>
        setFormData({
          ...formData,
          role: e.target.value,
        })
      }
      className="w-full p-3 border rounded-lg"
    >
<option value="ROLE_ADMIN">
  ADMIN
</option>

<option value="ROLE_USER">
  USER
</option>
    </select>

  </div>

  <div className="flex justify-end gap-3 mt-8">
    <Button
      variant="outline"
     onClick={closeEditModal}
    >
      Batal
    </Button>

    <Button onClick={handleUpdate} disabled={saving}>
     {saving ? "Menyimpan..." : "Simpan"}
    </Button>
  </div>
</Modal>
<Modal
  isOpen={successModal.isOpen}
  onClose={successModal.closeModal}
  className="max-w-[500px] p-8"
>
  <div className="text-center">

    <h3 className="mb-3 text-2xl font-semibold text-success-600">
      Berhasil
    </h3>
<p className="mb-6 text-gray-500">
  {successMessage}
</p>

    <Button
       onClick={() => {
    successModal.closeModal();
  }}
    >
      OK
    </Button>

  </div>
</Modal>
<Modal
  isOpen={errorModal.isOpen}
  onClose={errorModal.closeModal}
  className="max-w-[500px] p-8"
>
  <div className="text-center">

    <h3 className="mb-3 text-2xl font-semibold text-error-600">
      Gagal
    </h3>

    <p className="mb-6 text-gray-500">
    {errorMessage}
    </p>

    <Button
      variant="outline"
      onClick={errorModal.closeModal}
    >
      Tutup
    </Button>

  </div>
</Modal>
<Modal
  isOpen={deleteModal.isOpen}
  onClose={deleteModal.closeModal}
  className="max-w-[500px] p-6"
>
  <div className="text-center">

    <h3 className="mb-3 text-xl font-semibold text-error-600">
      Hapus User
    </h3>

    <p className="mb-6 text-gray-500">
      Yakin ingin menghapus user
      <br />
      <strong>
        {userToDelete?.username}
      </strong>
      ?
    </p>

    <div className="flex justify-center gap-3">

      <Button
        variant="outline"
        onClick={() => {
          setUserToDelete(null);
          deleteModal.closeModal();
        }}
      >
        Batal
      </Button>

      <Button
        onClick={handleDelete}
        disabled={saving}
      >
       {saving ? "Menghapus..." : "Hapus"}
      </Button>

    </div>

  </div>
</Modal>
<Modal
  isOpen={createModal.isOpen}
  onClose={createModal.closeModal}
  className="max-w-[600px] p-6"
>
  <h4 className="mb-6 text-xl font-semibold">
    Tambah User
  </h4>

  <div className="space-y-4">

    <input
      type="text"
      value={createFormData.username}
      onChange={(e) =>
        setCreateFormData({
          ...createFormData,
          username: e.target.value,
        })
      }
      placeholder="Username"
      className="w-full p-3 border rounded-lg"
    />

    <input
      type="email"
      value={createFormData.email}
      onChange={(e) =>
        setCreateFormData({
          ...createFormData,
          email: e.target.value,
        })
      }
      placeholder="Email"
      className="w-full p-3 border rounded-lg"
    />

    <input
      type="password"
      value={createFormData.password}
      onChange={(e) =>
        setCreateFormData({
          ...createFormData,
          password: e.target.value,
        })
      }
      placeholder="Password"
      className="w-full p-3 border rounded-lg"
    />

    <select
      value={createFormData.role}
      onChange={(e) =>
        setCreateFormData({
          ...createFormData,
          role: e.target.value,
        })
      }
      className="w-full p-3 border rounded-lg"
    >
      <option value="ROLE_ADMIN">
        ADMIN
      </option>

      <option value="ROLE_USER">
        USER
      </option>
    </select>

  </div>
{
  formError && (
    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
      {formError}
    </div>
  )
}
  <div className="flex justify-end gap-3 mt-8">

    <Button
      variant="outline"
     onClick={closeCreateModal}
    >
      Batal
    </Button>

    <Button
      onClick={handleCreate}
       disabled={saving}
    >
      {saving ? "Menyimpan..." : "Simpan"}
    </Button>

  </div>

</Modal>
    </div>
  );
}
