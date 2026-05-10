//
// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   return {
//     define: {
//       'process.env': env
//     },
//     plugins: [react()],
//   }
// });
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path"; // ✅ เพิ่ม

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   return {
//     define: {
//       "process.env": env,
//     },
//     resolve: {
//       alias: {
//         "@emotion/styled": path.resolve(
//           __dirname,
//           "node_modules/@emotion/styled/dist/emotion-styled.esm.js",
//         ),
//       },
//     },
//     plugins: [react()],
//   };
// });
// แก้styled-default is not function
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        "@emotion/styled": path.resolve(
          __dirname,
          "node_modules/@emotion/styled/dist/emotion-styled.esm.js",
        ),
      },
    },
    optimizeDeps: {
      include: ["@emotion/styled", "@emotion/react"], // ✅ บอก Vite ว่า “ต้องโหลดแน่นอน”
    },
    plugins: [react()],
  };
});


//
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
//
// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   return {
//     define: {
//       "process.env": env,
//     },
//     optimizeDeps: {
//         optimizeDeps: {
//     include: ['@mui/material', '@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
//   }
//     },
//     resolve: {
//       dedupe: [
//         "@mui/material",
//         "@mui/system",
//         "@emotion/react",
//         "@emotion/styled",
//       ],
//     },
//     plugins: [react()],
//   };
// });
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
//
// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//
//   return {
//     define: {
//       "process.env": env,
//     },
//
//     optimizeDeps: {
//       include: [
//         "@mui/material",
//         "@mui/system",
//         "@emotion/react",
//         "@emotion/styled",
//       ],
//     },
//
//     resolve: {
//       dedupe: [
//         "@mui/material",
//         "@mui/system",
//         "@emotion/react",
//         "@emotion/styled",
//       ],
//     },
//
//     plugins: [
//       react({
//         jsxImportSource: "@emotion/react",
//         babel: {
//           plugins: ["@emotion/babel-plugin"],
//         },
//       }),
//     ],
//   };
// });



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
//
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: [
//       '@mui/icons-material',
//       '@mui/material',
//       '@emotion/react',
//       '@emotion/styled',
//     ],
//   },
// });
