import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "@context/ThemeContext";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { mode, fontSize, fontFamily, toggleMode, setFontSize, setFontFamily } =
    useThemeContext();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {t("settings.title")}
      </Typography>

      <Stack spacing={3}>
        <Card>
          <CardHeader title={t("settings.appearance")} />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t("settings.themeMode")}
                </Typography>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  onChange={() => toggleMode()}
                  size="small"
                >
                  <ToggleButton value="light">
                    <LightMode sx={{ mr: 1 }} /> {t("settings.light")}
                  </ToggleButton>
                  <ToggleButton value="dark">
                    <DarkMode sx={{ mr: 1 }} /> {t("settings.dark")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t("settings.fontSize")}
                </Typography>
                <ToggleButtonGroup
                  value={fontSize}
                  exclusive
                  onChange={(_, value) => value && setFontSize(value)}
                  size="small"
                >
                  <ToggleButton value="small">
                    {t("settings.small")}
                  </ToggleButton>
                  <ToggleButton value="medium">
                    {t("settings.medium")}
                  </ToggleButton>
                  <ToggleButton value="large">
                    {t("settings.large")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t("settings.fontFamily")}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as any)}
                  >
                    <MenuItem value="Inter">Inter (English)</MenuItem>
                    <MenuItem value="Sarabun">Sarabun (ไทย)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={t("settings.language")} />
          <CardContent>
            <ToggleButtonGroup
              value={i18n.language}
              exclusive
              onChange={(_, value) => value && handleLanguageChange(value)}
              size="small"
            >
              <ToggleButton value="en">English</ToggleButton>
              <ToggleButton value="th">ภาษาไทย</ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
