import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "@services/api";

interface Position {
  id: number;
  name: string;
  description: string;
}

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<Position | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/positions");
      setPositions(response.data.ResultOnDb || []);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleOpenDialog = (item?: Position) => {
    if (item) {
      setEditItem(item);
      setFormData({ name: item.name, description: item.description || "" });
    } else {
      setEditItem(null);
      setFormData({ name: "", description: "" });
    }
    setOpenDialog(true);
    setError("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      if (editItem) {
        await api.put(`/positions/${editItem.id}`, formData);
      } else {
        await api.post("/positions", formData);
      }
      handleCloseDialog();
      fetchPositions();
    } catch (err: any) {
      setError(err.response?.data?.Message || "Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    try {
      await api.delete(`/positions/${id}`);
      fetchPositions();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Positions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Position
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={80}>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell width={120} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No positions found
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((pos) => (
                  <TableRow key={pos.id} hover>
                    <TableCell>{pos.id}</TableCell>
                    <TableCell>{pos.name}</TableCell>
                    <TableCell>{pos.description || "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(pos)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(pos.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editItem ? "Edit Position" : "Add Position"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Positions;
