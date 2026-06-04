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
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-800/40">

        <div className="flex items-center gap-3">

          <Button size="sm" onClick={createModal.openModal}>
            + Tambah User
          </Button>

          <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Tampilkan
          </span>

          <div className="relative">
            <select
              className="h-8 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-7 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option key={value} value={value} className="dark:bg-gray-800">
                  {value}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>

          <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            entri
          </span>

        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="currentColor"/>
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari user..."
            className="h-9 w-full rounded-lg border border-gray-200 bg-white py-0 pl-9 pr-4 text-sm text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 xl:w-[280px]"
          />
        </div>

      </div>

      {/* ── Table ── */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Table>

          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/60">

              {[
                { key: "username", label: "Username" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
              ].map(({ key, label }) => (
                <TableCell
                  key={key}
                  isHeader
                  className="border-b border-gray-100 px-5 py-3.5 dark:border-gray-800"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between gap-3"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {label}
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon
                        className={`text-gray-300 dark:text-gray-700 ${
                          sortKey === key && sortOrder === "asc" ? "text-brand-500" : ""
                        }`}
                      />
                      <AngleDownIcon
                        className={`text-gray-300 dark:text-gray-700 ${
                          sortKey === key && sortOrder === "desc" ? "text-brand-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                </TableCell>
              ))}

              <TableCell
                isHeader
                className="border-b border-gray-100 px-5 py-3.5 dark:border-gray-800"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Aksi
                </p>
              </TableCell>

            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-gray-300" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((user) => (
                <TableRow
                  key={user.id}
                  className="group border-b border-gray-50 transition-colors last:border-0 hover:bg-blue-50/50 dark:border-gray-800/60 dark:hover:bg-blue-950/20"
                >

                  <TableCell className="px-5 py-3.5 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {user.username}
                  </TableCell>

                  <TableCell className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </TableCell>

                  <TableCell className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.role === "ROLE_ADMIN"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setUserToDelete(user); deleteModal.openModal(); }}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title="Hapus"
                      >
                        <TrashBinIcon />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        title="Edit"
                      >
                        <PencilIcon />
                      </button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/60 px-5 py-4 xl:flex-row dark:border-gray-800 dark:bg-gray-800/40">

        <PaginationWithButton
          totalPages={totalPages}
          initialPage={currentPage}
          onPageChange={handlePageChange}
        />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {startIndex + 1}–{endIndex}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {totalItems}
          </span>{" "}
          entri
        </p>

      </div>

      {/* ── Modal: Edit User ── */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} className="max-w-[560px] p-6">

        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">Edit User</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Perbarui informasi akun pengguna</p>

        <div className="space-y-3">
          {[
            { type: "text", value: formData.username, field: "username", placeholder: "Username" },
            { type: "email", value: formData.email, field: "email", placeholder: "Email" },
            { type: "password", value: formData.password, field: "password", placeholder: "Kosongkan jika tidak diganti" },
          ].map(({ type, value, field, placeholder }) => (
            <input
              key={field}
              type={type}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          ))}

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_USER">User</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeEditModal}>Batal</Button>
          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>

      </Modal>

      {/* ── Modal: Tambah User ── */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} className="max-w-[560px] p-6">

        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">Tambah User</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Buat akun pengguna baru</p>

        <div className="space-y-3">
          {[
            { type: "text", value: createFormData.username, field: "username", placeholder: "Username" },
            { type: "email", value: createFormData.email, field: "email", placeholder: "Email" },
            { type: "password", value: createFormData.password, field: "password", placeholder: "Password" },
          ].map(({ type, value, field, placeholder }) => (
            <input
              key={field}
              type={type}
              value={value}
              onChange={(e) => setCreateFormData({ ...createFormData, [field]: e.target.value })}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          ))}

          <select
            value={createFormData.role}
            onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_USER">User</option>
          </select>
        </div>

        {formError && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeCreateModal}>Batal</Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>

      </Modal>

      {/* ── Modal: Hapus User ── */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} className="max-w-[440px] p-6">
        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <TrashBinIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
          </div>

          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">Hapus User</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Yakin ingin menghapus{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{userToDelete?.username}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { setUserToDelete(null); deleteModal.closeModal(); }}>
              Batal
            </Button>
            <Button onClick={handleDelete} disabled={saving}>
              {saving ? "Menghapus..." : "Hapus"}
            </Button>
          </div>

        </div>
      </Modal>

      {/* ── Modal: Berhasil ── */}
      <Modal isOpen={successModal.isOpen} onClose={successModal.closeModal} className="max-w-[440px] p-6">
        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">Berhasil</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{successMessage}</p>
          <Button onClick={successModal.closeModal}>OK</Button>

        </div>
      </Modal>

      {/* ── Modal: Gagal ── */}
      <Modal isOpen={errorModal.isOpen} onClose={errorModal.closeModal} className="max-w-[440px] p-6">
        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>

          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">Gagal</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{errorMessage}</p>
          <Button variant="outline" onClick={errorModal.closeModal}>Tutup</Button>

        </div>
      </Modal>

    </div>
  );
}
