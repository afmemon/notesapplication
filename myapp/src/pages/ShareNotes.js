import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";

function ShareNotes() {
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedNoteBySomeone();
  }, []);

  const getSharedNoteBySomeone = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      let result = await axiosClient.get("/api/getsharenotes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { status, data } = result.data;

      setLoading(false);

      if (!status) {
        return;
      }

      setNotesList(data);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary " role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="row my-5">
        {!!notesList.length &&
          notesList.map((v, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <div className="card mb-3 cardBox">
                <div className="card-header d-flex justify-content-between">
                  <h3>{v.title}</h3>
                  <div className="d-flex justify-content-between align-items-center">
                    Share by:&nbsp; <b>{v.name}</b>
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
          ))}
      </div>
    );
  }
}

export default ShareNotes;
