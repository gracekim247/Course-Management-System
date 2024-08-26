import { Alert } from "@mui/material";

export default function Error() {
  return (
    <Alert variant="filled" severity="error">
      Failed to fetch information about the Leadership Courses.
    </Alert>
  );
}
