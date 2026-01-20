import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "@context/AuthContext";
import api from "@services/api";

interface DashboardStats {
  totalEmployees: number;
  departments: number;
  positions: number;
  activeRate: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard = ({ title, value, icon, color, loading }: StatCardProps) => (
  <Card>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={40} />
          ) : (
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        if (response.data.Status) {
          setStats(response.data.ResultOnDb);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          totalEmployees: 0,
          departments: 0,
          positions: 0,
          activeRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        {t("dashboard.title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t("dashboard.welcome")}, {user?.first_name || user?.username}!
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t("dashboard.totalEmployees")}
            value={stats?.totalEmployees ?? 0}
            icon={<PeopleIcon />}
            color="#6366f1"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t("dashboard.departments")}
            value={stats?.departments ?? 0}
            icon={<BusinessIcon />}
            color="#10b981"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t("dashboard.positions")}
            value={stats?.positions ?? 0}
            icon={<WorkIcon />}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t("dashboard.activeRate")}
            value={`${stats?.activeRate ?? 0}%`}
            icon={<TrendingIcon />}
            color="#ec4899"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Quick Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is your Employee Management System dashboard. Use the sidebar
              to navigate between different sections. You can manage employees,
              departments, positions, and customize your settings.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
