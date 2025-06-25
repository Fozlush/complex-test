import type { NextConfig } from "next";
const path = require('path');

const nextConfig: NextConfig = {
   sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    additionalData: `
      @use "src/styles/variables" as *;
      @use "src/styles/mixins" as *;
    `,
  },
};

export default nextConfig;
