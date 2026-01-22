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
  TextField,
  InputAdornment,
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

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);
    // ป้องกันค่าติดลบ หรือค่าว่าง
    if (!isNaN(val) && val > 0) {
      setFontSize(val);
    }
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
                <TextField
                  type="number"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  size="small"
                  sx={{ width: 150 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                    inputProps: { min: 10, max: 40 } 
                  }}
                />
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
                    <MenuItem value="Kanit">Kanit (ไทย)</MenuItem>
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
