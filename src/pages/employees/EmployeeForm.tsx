import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import api from "@services/api";

interface FormData {
  employee_id: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  department_id: string;
  position_id: string;
  role: string;
  status: string;
  hire_date: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

const initialFormData: FormData = {
  employee_id: "",
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  department_id: "",
  position_id: "",
  role: "EMPLOYEE",
  status: "ACTIVE",
  hire_date: "",
};

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.ResultOnDb || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get("/positions");
      setPositions(response.data.ResultOnDb || []);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}`);
      const emp = response.data.ResultOnDb;
      setFormData({
        employee_id: emp.employee_id || "",
        username: emp.username || "",
        email: emp.email || "",
        password: "",
        first_name: emp.first_name || "",
        last_name: emp.last_name || "",
        phone: emp.phone || "",
        department_id: emp.department_id?.toString() || "",
        position_id: emp.position_id?.toString() || "",
        role: emp.role || "EMPLOYEE",
        status: emp.status || "ACTIVE",
        hire_date: emp.hire_date ? emp.hire_date.split("T")[0] : "",
      });
    } catch (err) {
      setError("Failed to fetch employee data");
    }
  };

  const handleChange = (field: keyof FormData) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.employee_id) return "Employee ID is required";
    if (!formData.username) return "Username is required";
    if (!formData.email) return "Email is required";
    if (!isEdit && !formData.password) return "Password is required";
    if (!isEdit && formData.password.length < 8)
      return "Password must be at least 8 characters";
    if (!formData.first_name) return "First name is required";
    if (!formData.last_name) return "Last name is required";
    if (!formData.department_id) return "Department is required";
    if (!formData.position_id) return "Position is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        department_id: parseInt(formData.department_id),
        position_id: parseInt(formData.position_id),
      };

      if (isEdit) {
        const { password, username, email, ...updateData } = payload;
        await api.put(`/employees/${id}`, updateData);
        setSuccess("Employee updated successfully!");
      } else {
        await api.post("/employees", payload);
        setSuccess("Employee created successfully!");
        setTimeout(() => navigate("/employees"), 1500);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        "Failed to save employee";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/employees")}
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
      >
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={formData.employee_id}
                  onChange={handleChange("employee_id")}
                  required
                  placeholder="e.g., EMP001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange("username")}
                  required
                  disabled={isEdit}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  disabled={isEdit}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={handleChange("first_name")}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={handleChange("last_name")}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  placeholder="e.g., 0812345678"
                />
              </Grid>
              {!isEdit && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                    helperText="Minimum 8 characters"
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Work Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department_id}
                    onChange={handleChange("department_id")}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={formData.position_id}
                    onChange={handleChange("position_id")}
                    label="Position"
                  >
                    {positions.map((pos) => (
                      <MenuItem key={pos.id} value={pos.id}>
                        {pos.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleChange("role")}
                    label="Role"
                  >
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleChange("status")}
                    label="Status"
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Hire Date"
                  value={formData.hire_date}
                  onChange={handleChange("hire_date")}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Employee"
                    : "Create Employee"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/employees")}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;
