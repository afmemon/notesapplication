import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import axiosClient from "../axiosClient";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category_id: "",
  });
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    edit: false,
    id: "",
  });
  const [noteId, setNoteId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [query, setQuery] = useState({
    category_id: "",
    search: "",
  });

  const getAllNotes = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.get("/api/getallnotes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { status, data } = result.data;

      setLoading(false);

      if (!status) {
        // toast("Notes Not Found");
        return;
      }

      setNotesList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getAllCategory = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.get("/api/getcategories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = result.data;

      setCategoryList(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllNotes();
    getAllCategory();
  }, []);

  const handleChange = async (e) => {
    try {
      let temp = { ...formData };
      temp[e.target.name] = e.target.value;
      setFormData(temp);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.post("/api/createnote", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { status } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      toast("Note created successfully");

      getAllNotes();

      setFormData({
        title: "",
        description: "",
        tags: "",
        category_id: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const ShowTags = ({ tags }) => {
    try {
      let d = tags.split(",").filter((item) => item !== "");

      return (
        <>
          Tags: <b>{d.join(", ")}</b>
        </>
      );
    } catch (e) {
      console.log();
      return null;
    }
  };

  const handleDeleteNotes = async (id) => {
    try {
      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.get(`/api/deletenote/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { status } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      getAllNotes();

      toast("Note Deleted Successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditNotes = async (id) => {
    try {
      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.get(`/api/editnote/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status, data } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        tags: data.tags,
        category_id: data.category_id,
      });

      setEditData({
        edit: true,
        id: data.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onUpdate = async (e) => {
    try {
      e.preventDefault();

      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.put(
        `/api/updatenote/${editData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { status } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      toast("Note updated successfully");

      getAllNotes();

      setFormData({
        title: "",
        description: "",
        tags: "",
        category_id: "",
      });

      setEditData({
        edit: false,
        id: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const setSearchParams = async (e) => {
    try {
      let temp = { ...query };
      temp[e.target.name] = e.target.value;
      setQuery(temp);
    } catch (e) {
      console.log(e);
    }
  };

  const getMySearchResults = async (e) => {
    try {
      e.preventDefault();

      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.post("/api/searchnotes", query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data, category } = result.data;

      if (!data?.length && !category.length) {
        toast("Record not found");
        return;
      }

      let temp = [...data, ...category];

      setNotesList(temp);
      setQuery({
        category_id: "",
        search: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cancelSearch = async () => {
    try {
      setQuery({
        category_id: "",
        search: "",
      });

      getAllNotes();
    } catch (e) {
      console.log(e);
    }
  };

  const { edit } = editData;

  return (
    <Container>
      <div className="row">
        <div className="col-12 col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6 mt-5">
          <form
            onSubmit={edit ? onUpdate : onSubmit}
            className="bg-white p-5 shadow"
            style={{ borderRadius: 12 }}
          >
            <div className="row">
              <div className="col-12">
                <h1>{edit ? "Edit Notes" : "Create Notes"} </h1>
              </div>

              <div className="col-12 mt-3">
                <label>Category : </label>
                <br />
                <select
                  className="form-select"
                  onChange={handleChange}
                  name="category_id"
                  value={formData.category_id}
                  required
                >
                  <option value={""}>Select Category</option>
                  {!!categoryList?.length &&
                    categoryList.map((v, i) => (
                      <option key={v.id} value={v.id}>
                        {v.category_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-12 mt-3">
                <label>Title: </label>
                <br />
                <input
                  required
                  type="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter here title"
                />
              </div>

              <div className="col-12 mt-3">
                <label>Description: </label>
                <br />
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter here description"
                  rows={6}
                />
              </div>

              <div className="col-12 mt-3">
                <label>Tags: </label>
                <br />
                <textarea
                  required
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter here tags"
                  rows={4}
                />
              </div>

              <div className="col-12 mt-3">
                <button
                  className="btn text-white"
                  style={{ backgroundColor: "#0a98bf" }}
                >
                  {edit ? "Update Note" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12 col-md-2 col-lg-3"></div>
      </div>

      <form onSubmit={getMySearchResults}>
        <div className="row my-5">
          <div className="col-md-4">
            <label>
              <b>Category :</b>{" "}
            </label>
            <br />
            <select
              className="form-select"
              onChange={setSearchParams}
              name="category_id"
              value={query.category_id}
            >
              <option value={""}>Select Category</option>
              {!!categoryList?.length &&
                categoryList.map((v, i) => (
                  <option key={v.id} value={v.id}>
                    {v.category_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-4">
            <label>
              <b>Search:</b>
            </label>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Write here to search"
              onChange={setSearchParams}
              value={query.search}
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary  mt-4">
              Search Note
            </button>{" "}
            &nbsp;&nbsp;
            <button
              onClick={() => cancelSearch()}
              type="button"
              className="btn btn-danger  mt-4"
            >
              Cancel Search
            </button>
          </div>
        </div>
      </form>

      <div className="row my-5">
        {loading ? (
          <div className="col-md-12">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          !!notesList.length &&
          notesList.map((v, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <div className="card mb-3 cardBox">
                <div className="card-header d-flex justify-content-between">
                  <h3>{v.title}</h3>

                  <div className="d-flex justify-content-between">
                    <img
                      style={{
                        width: "20px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      src="https://cdn-icons-png.flaticon.com/512/7398/7398464.png"
                      onClick={() => handleEditNotes(v.id)}
                      alt=""
                    />
                    &nbsp; &nbsp;
                    <img
                      style={{
                        width: "20px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      src="https://static-00.iconduck.com/assets.00/delete-icon-1864x2048-bp2i0gor.png"
                      onClick={() => handleDeleteNotes(v.id)}
                      alt=""
                    />
                    &nbsp; &nbsp;
                    <img
                      style={{
                        width: "20px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      src="https://cdn-icons-png.flaticon.com/512/7066/7066144.png"
                      onClick={() => {
                        setModalShow(true);
                        setNoteId(v.id);
                      }}
                      alt=""
                    />
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text">{v.description}</p>

                  <p>
                    <ShowTags tags={v.tags} />
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ShareUserModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        noteId={noteId}
      />
    </Container>
  );
};

export default Dashboard;

const ShareUserModal = ({ noteId, ...other }) => {
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState("");

  const getUserList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const result = await axiosClient.get("/api/getusers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { status, data } = result.data;

      if (!status) return;

      setUserList(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  const noteShareHandle = async (e) => {
    try {
      e.preventDefault();

      const body = {
        share_to: userId,
        note_id: noteId,
      };

      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.post("/api/sharenotes", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { status } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      toast("Note share successfully");
      other.onHide();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      {...other}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={noteShareHandle}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Share Notes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>
            <b>Select user</b>
          </label>
          <select
            className="form-select"
            onChange={(e) => setUserId(e.target.value)}
            name="userid"
          >
            <option value={""}>Select User</option>
            {!!userList?.length &&
              userList.map((v, i) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => other.onHide()} className="btn btn-danger">
            Close
          </Button>
          <Button type="submit">Share</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
