import React, { useState, useEffect } from "react";
import API from "./api";

export default function Student({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editMarks, setEditMarks] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMarks, setNewMarks] = useState("");
  const [modalError, setModalError] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [editStudentId, setEditStudentId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchStudents = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const response = await API.get(
        `students/?page=${page}&search=${searchQuery}`
      );
      setStudents(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
      setCurrentPage(page);
      setError(null);
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents(1, search);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleInlineEdit = (student) => {
    setEditId(student.id);
    setEditMarks(student.marks.toString());
  };

  const saveInlineEdit = async (id) => {
    try {
      const numericMarks = Number(editMarks);
      if (isNaN(numericMarks) || numericMarks < 0) throw new Error();
      await API.put(`students/${id}/`, { marks: numericMarks });
      setStudents(
        students.map((s) => (s.id === id ? { ...s, marks: numericMarks } : s))
      );
      setEditId(null);
      setEditMarks("");
    } catch {
      setError("Failed to update marks");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await API.delete(`students/${id}/`);
      setStudents(students.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete student");
    }
  };

  const openModal = () => {
    setModalMode("add");
    setShowModal(true);
    setNewName("");
    setNewSubject("");
    setNewMarks("");
    setModalError(null);
    setEditStudentId(null);
  };

  const openEditModal = (student) => {
    setModalMode("edit");
    setShowModal(true);
    setNewName(student.name);
    setNewSubject(student.subject);
    setNewMarks(student.marks.toString());
    setEditStudentId(student.id);
    setModalError(null);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (!newName.trim() || !newSubject.trim() || newMarks === "") {
      setModalError("All fields are required");
      return;
    }

    const numericMarks = Number(newMarks);
    if (isNaN(numericMarks) || numericMarks < 0) {
      setModalError("Marks must be a non-negative number");
      return;
    }

    try {
      if (modalMode === "add") {
        const existing = students.find(
          (s) =>
            s.name.toLowerCase() === newName.trim().toLowerCase() &&
            s.subject.toLowerCase() === newSubject.trim().toLowerCase()
        );

        if (existing) {
          const updatedMarks = existing.marks + numericMarks;
          await API.put(`students/${existing.id}/`, { marks: updatedMarks });
          setStudents(
            students.map((s) =>
              s.id === existing.id ? { ...s, marks: updatedMarks } : s
            )
          );
        } else {
          const response = await API.post("students/", {
            name: newName.trim(),
            subject: newSubject.trim(),
            marks: numericMarks,
          });
          setStudents([...students, response.data]);
        }
      } else if (modalMode === "edit" && editStudentId !== null) {
        await API.put(`students/${editStudentId}/`, {
          name: newName.trim(),
          subject: newSubject.trim(),
          marks: numericMarks,
        });
        setStudents(
          students.map((s) =>
            s.id === editStudentId
              ? {
                  ...s,
                  name: newName.trim(),
                  subject: newSubject.trim(),
                  marks: numericMarks,
                }
              : s
          )
        );
      }

      closeModal();
    } catch {
      setModalError("Failed to save student");
    }
  };

  if (loading) return <div className="container mt-4">Loading students...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Student List</h3>
        <div>
          <button className="btn btn-success me-2" onClick={openModal}>
            Add Student
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("token");
              onLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.subject}</td>
              <td>
                {editId === student.id ? (
                  <input
                    type="number"
                    className="form-control"
                    value={editMarks}
                    onChange={(e) => setEditMarks(e.target.value)}
                    style={{ maxWidth: "100px" }}
                  />
                ) : (
                  student.marks
                )}
              </td>
              <td>
                {editId === student.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => saveInlineEdit(student.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => openEditModal(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => fetchStudents(currentPage - 1, search)}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => fetchStudents(currentPage + 1, search)}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmitModal} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "add" ? "Add New Student" : "Edit Student"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalError && (
                  <div className="alert alert-danger">{modalError}</div>
                )}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Marks</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
