import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestHeaders } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

const getAuthToken = () => {
  return localStorage.getItem("authorization_token");
};

const getHeaders = () => {
  const authToken = getAuthToken();
  const result: AxiosRequestHeaders = {};

  if (authToken) {
    result.Authorization = `Basic ${getAuthToken()}`;
  }

  return result;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      // Get the presigned URL
      const response = await axios.get(url, {
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: getHeaders(),
      });

      await fetch(response.data, {
        method: "PUT",
        body: file,
      });
    } catch (error) {}
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
