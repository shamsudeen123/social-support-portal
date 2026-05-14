import { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ar';
import getTheme from './theme';
import Header from './components/common/Header';
import ApplicationPage from './pages/ApplicationPage';
import SplashScreen from './components/common/SplashScreen';
import { RootState } from './store';
import './i18n';

const cacheLtr = createCache({ key: 'mui' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const App = () => {
  const { themeMode, language } = useSelector((s: RootState) => s.ui);
  const { i18n } = useTranslation();
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
  }, [language, direction, i18n]);

  const theme = useMemo(() => getTheme(themeMode, direction), [themeMode, direction]);

  const locale = language === 'ar' ? 'ar' : 'en';

  return (
    <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <CssBaseline />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <BrowserRouter>
          <div dir={direction}>
            <Header />
            <Routes>
              <Route path="/" element={<ApplicationPage />} />
            </Routes>
          </div>
        </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
